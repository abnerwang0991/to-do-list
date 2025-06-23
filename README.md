# To Do List

## 需求釐清

1. 新增代辦事項
2. 將代辦事項變更為未完成/已完成
3. 刪除代辦事項
4. 編輯代辦事項
5. 上一步：返回至上一個操作步驟
6. 下一步：更新至下一個操作步驟
7. 更新歷史紀錄：若在中間步驟執行 1~4 動作，則取代歷史紀錄該步驟後面的步驟，重新記錄

## 架構

- UI
  - ToDoList(index): Container
  - AddTask: 新增代辦事項
  - TaskList: 顯示代辦事項列表
  - TaskListItem: 顯示個別代辦事項
  - UndoRedoControl: 控制上一步/下一步
- 狀態管理（Zustand）：
  - 使用 `Zustand` 建立中心化的 `useStore` store
  - 將所有代辦事項狀態與邏輯集中管理，包含：
    - 代辦事項列表
    - 新增 / 移除 / 切換狀態
    - Undo / Redo 機制
  - UI 元件透過 hook 訂閱所需狀態與操作函數，實現單向資料流

## 資料模組

| 狀態           | 來源         | 歸屬            | 描述                 |
| -------------- | ------------ | --------------- | -------------------- |
| tasks          | store        | TaskList        | 代辦事項列表         |
| historyPointer | store        | UndoRedoControl | 當前對應歷史紀錄指針 |
| history        | store        | UndoRedoControl | 歷史紀錄             |
| text           | AddTask      | AddTask         | 代辦事項文字         |
| isEditing      | TaskListItem | TaskListItem    | 是否為編輯狀態       |
| text           | TaskListItem | TaskListItem    | 編輯代辦事項文字     |

## 介面設計

| Prop  | 來源     | 歸屬         | 描述             |
| ----- | -------- | ------------ | ---------------- |
| task  | TaskList | TaskListItem | 個別代辦事項     |
| index | TaskList | TaskListItem | 個別代辦事項索引 |

| Action            | 來源         | 歸屬                   | 描述                  |
| ----------------- | ------------ | ---------------------- | --------------------- |
| addTask           | store        | store                  | 新增代辦事項          |
| changeTask        | store        | store                  | 變更代辦事項文字/狀態 |
| deleteTask        | store        | store                  | 刪除代辦事項          |
| handleTaskAction  | store        | AddTask / TaskListItem | 處理代辦事項相關動作  |
| setHistoryPointer | store        | store                  | 設定歷史紀錄指針      |
| addHistoryStep    | store        | store                  | 新增歷史紀錄          |
| sliceHistory      | store        | store                  | 擷取歷史紀錄          |
| redo              | store        | UndoRedoControl        | 上一步                |
| undo              | store        | UndoRedoControl        | 下一步                |
| onSubmit          | AddTask      | AddTask                | 新增代辦事項          |
| onChangeStatus    | TaskListItem | TaskListItem           | 變更代辦事項狀態      |
| onSubmit          | TaskListItem | TaskListItem           | 變更代辦事項文字      |

## 優化

- 使用者體驗優化
  - Input autofocus
  - Input keydown enter
