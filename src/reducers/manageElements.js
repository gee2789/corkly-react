export const manageElements = (state={boardElements: [], boardId: null}, action) => {
  switch (action.type) {
    case "ADD_ELEMENT":
      return Object.assign({}, state, {boardElements: [...state.boardElements, action.payload]})
    case "UPDATE_ELEMENT":
      return Object.assign({}, state, {boardElements: state.boardElements.map((element) => {
        if(element.EID === action.payload.element.EID){
          return Object.assign({}, element, action.payload.element)
        } else {
          return element
        }
      })})
    case "SET_CURRENT_BOARD":
      return Object.assign({}, state, {
        boardId: action.data.id,
        boardElements: action.data.elements
     })
    case "ASSIGN_TO_BOARD":
      return Object.assign({}, state, {boardId: action.payload})
    case "DELETE_ELEMENT":
      return Object.assign({}, state, {boardElements: state.boardElements.filter(elm => elm.EID !== action.payload)})

    default:
      return state
  }
}
