// budget controller
let budgetController = (() => {
   
})();

// UI controller
let UIController = (() => {
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    }
    return {
        getinput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMStrings: () => {
            return DOMStrings;
        }
    };
})();


// Global app controller
let controller = ((budgetCtrl, UICtrl) => {

    let setupEventListeners = () => {
        let DOM = UICtrl.getDOMStrings();
        let btn = document.querySelector(DOM.inputBtn);

        btn.addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', event => {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    let ctrlAddItem = () => {
        // 1. Get the field input data
        let input = UICtrl.getinput();
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    };

    return {
        init: () => {
            console.log('Application has started.');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();