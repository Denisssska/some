import {PayLoadTodolistType, todolistAPI, TodolistsType} from "../../../API/TodolistApi";
import {AppThunk, StateAppType} from "../../../state/redux-store";
import {changeProcessAC, loadingErrorAC, setErrAC} from "../../../app/AppReducer";
import {handleServerAppError, handleServerNetworkError} from "../../../components/ErrorSnackBar/HandleError";


const REMOVE_TODOLIST = "remove todolist";
const ADD_TODOLIST = "add todolist";
const GET_ARRAY = 'GET_ARRAY';
const IS_DISABLED = 'IS_DISABLED';
const UPDATE_TODOLIST = 'UPDATE_TODOLIST'
const initialState = {
    todolists: [] as Array<TodolistsType>
}

export type InitialTodolistStateType = typeof initialState

export type TodolistsActionType = ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof getTodolistAC>
    | ReturnType<typeof disableTodolistAC>
    | ReturnType<typeof updateTodolistAC>

export const getTodolistAC = (data: Array<TodolistsType>) => ({type: GET_ARRAY, data}) as const
export const disableTodolistAC = (isDisabled: boolean, todolistId: string) => ({
    type: IS_DISABLED,
    isDisabled,
    todolistId
}) as const
export const removeTodolistAC = (todolistId: string) => ({type: "remove todolist", todolistId}) as const
export const updateTodolistAC = (todolistId: string, payLoad: PayLoadTodolistType) => ({
    type: UPDATE_TODOLIST,
    todolistId,
    payLoad
}) as const
export const addTodolistAC = (todolist: TodolistsType) => ({
    type: "add todolist",
    todolist
}) as const

export const todolistReducer = (state: InitialTodolistStateType = initialState, action: TodolistsActionType): InitialTodolistStateType => {

    switch (action.type) {
        case GET_ARRAY: {
            return {...state, todolists: [...action.data]}
        }
        case REMOVE_TODOLIST: {
            return {...state, todolists: state.todolists.filter((el) => el.id !== action.todolistId)}
        }
        case ADD_TODOLIST: {
            return {...state, todolists: [{...action.todolist, filter: 'all', isDisabled: false}, ...state.todolists]}

        }
        case IS_DISABLED: {
            return {
                ...state, todolists: state.todolists.map((item) => item.id === action.todolistId ? {
                    ...item,
                    isDisabled: action.isDisabled
                } : item)
            }
        }
        case "UPDATE_TODOLIST": {
            return {
                ...state, todolists: state.todolists.map(item => item.id === action.todolistId ?
                    {...item, ...action.payLoad} : item)
            }
        }
        default:
            return state
    }
}

export const getTodolistsTC = (): AppThunk => (dispatch) => {
    todolistAPI.getTodolists()
        .then((data) => {
                if (data)
                    dispatch(getTodolistAC(data.data))
                dispatch(changeProcessAC(false))
                dispatch(loadingErrorAC(true))
                dispatch(setErrAC('Successfully'))
            }
        )
        .catch((e) => {
                handleServerNetworkError(e.message, dispatch)
            }
        )
}
export const addTodolistsTC = (title: string): AppThunk => (dispatch) => {
    dispatch(changeProcessAC(true))
    todolistAPI.createTodolist(title)
        .then((data) => {
                if (data.data.resultCode === 0) {
                    data.data.data.item && dispatch(addTodolistAC(data.data.data.item))
                    dispatch(changeProcessAC(false))
                    dispatch(loadingErrorAC(true))
                    dispatch(setErrAC('Successfully'))
                } else {
                    handleServerAppError(data.data, dispatch)
                    dispatch(changeProcessAC(false))
                }
            }
        )
        .catch(e => {
                handleServerNetworkError(e.message, dispatch)
            }
        )
}
export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(changeProcessAC(true))
    dispatch(updateTodolistAC(todolistId, {isDisabled: true}))
    todolistAPI.deleteTodolist(todolistId)
        .then((data) => {
                if (data.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(changeProcessAC(false))
                    dispatch(loadingErrorAC(true))
                    dispatch(setErrAC('Successfully'))
                } else {
                    handleServerAppError(data.data, dispatch)
                }
            }
        )
        .catch(e => {
                handleServerNetworkError(e.message, dispatch)
            }
        )
}
export const updateTodolistTC = (todolistId: string, item: PayLoadTodolistType): AppThunk =>
    (dispatch, getState: () => StateAppType) => {
        const state = getState()
        const newTodolist = state.todolist.todolists.find(item => item.id === todolistId)
        if (!newTodolist) return
        let payLoad = {
            title: newTodolist.title,
            isDisabledTask: newTodolist.isDisabled,
            filter: newTodolist.filter, ...item
        } as PayLoadTodolistType
        dispatch(changeProcessAC(true))
        todolistAPI.updateTodolist(todolistId, payLoad).then(data => {
                if (data.data.resultCode === 0) {
                    dispatch(updateTodolistAC(todolistId, payLoad))
                    dispatch(changeProcessAC(false))
                    dispatch(loadingErrorAC(true))
                    dispatch(setErrAC('Successfully'))
                } else {
                    handleServerAppError(data.data,dispatch)
                    dispatch(changeProcessAC(false))
                }
            }
        ).catch(e => {
                handleServerNetworkError(e.message, dispatch)
            }
        )
    }

