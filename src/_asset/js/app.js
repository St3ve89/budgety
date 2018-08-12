// budget controller
let budgetController = (() => {
   
})();

// UI controller
let UIController = (() => {

    // some code

})();


// Global app controller
let controller = ((budgetCtrl, UICtrl) => {
    let ctrlAddItem = () => {
        // 1. Get the field input data
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log('It works')
    }

    let btn = document.querySelector('.add__btn');
    btn.addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', event => {
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    })
})(budgetController, UIController);