import {todolistReducer, TodolistsActionType} from "../features/todolistList/todolist/todolistReducer";
import {taskReducer, TasksActionsType} from "../features/todolistList/todolist/task/TaskReducer";
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import thunk, {ThunkAction,ThunkDispatch} from "redux-thunk";

export type StateAppType = ReturnType<typeof reducersBox>
const reducersBox = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
})
let store = legacy_createStore(reducersBox,applyMiddleware(thunk))
// export type StoreType = typeof store;

export default store
export type AppActionsType = TodolistsActionType |TasksActionsType
export type ThunkType = ThunkAction<void,StateAppType,unknown,AppActionsType>
// export type AppDispatch = typeof  store.dispatch
export type AppDispatch = ThunkDispatch< RootState,
    unknown,
    AnyAction>

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
    >