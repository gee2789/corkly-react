export const manageElements = (state={boardElements: []}, action) => {
  switch (action.type) {
    case "ADD_ELEMENT":
      return Object.assign({}, state, {boardElements: [...state.boardElements, action.payload]})
    case "UPDATE_ELEMENT_CONTENT":
      return Object.assign({}, state, {boardElements: state.boardElements.map((element) => {
        if (element.id === action.payload.id) {
          return Object.assign({}, element, {content: action.payload.content})
        } else {
          return element
        }
      })})
    case "CHANGE_POSITION":
      let newState = [...state.boardElements, action.newElement]
      return {baordElements: newState}
    default:
      return state
  }
}