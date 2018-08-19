// budget controller
let budgetController = ( () => {
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = type => {
        let sum = 0;
        data.allItems[type].forEach( cur => {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
            totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            //create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //create new item based 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;

        },

        deleteItem: (type,id) => {
            // id = 6
            // data.allItems[type][id];
            // ids = [1 2 4 6 8]
            // index = 3

            let ids = data.allItems[type].map( current => {
                return current.id;
            });

            let index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: () => {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: () => {
            data.allItems.exp.forEach( cur => {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: () => {
            let allPerc = data.allItems.exp.map( cur => {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: () => {
            console.log(data);
        }
    }

})();

// UI controller
let UIController = ( () => {
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    let formatNumber = (num, type) => {
        // + or - before number, exactly 2 decimal points, comma separating the thousands : 2310.4567 -> + 2,310.46  or 2000 -> 2,000.00

        num = Math.abs(num);
        num = num.toFixed(2);

        let numSplit = num.split('.');

        let int = numSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);  //input 23510, output 23,510
        }

        let dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };


    return {
        getinput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: (obj, type) => {
            let html, newHtml, element;
            // create html string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>';
            }

            // replace the placeholder text with some data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: selectorId => {
            let el = document.getElementById(selectorId);

            el.parentNode.removeChild(el);

        },

        clearFields: () => {
            let fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            let fieldsArr = Array.prototype.slice.call(fields);
            // set back the value
            fieldsArr.forEach( (current, index, array) => {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: obj => {
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage}%`;
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';

            }
        },

        displayPercentages: percentages => {
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            let nodeListforEach = (list, callback) => {
                for(let i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

            nodeListforEach(fields, (current, index) => {
                if(percentages[index] > 0) {
                    current.textContent = `${percentages[index]}%`;
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: () => {
            let now = new Date();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let month = now.getMonth();
            let year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        getDOMStrings: () => {
            return DOMStrings;
        }
    };
})();


// Global app controller
let controller = ( (budgetCtrl, UICtrl) => {

    let setupEventListeners = () => {
        let DOM = UICtrl.getDOMStrings();
        let btn = document.querySelector(DOM.inputBtn);

        btn.addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', event => {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    let updateBudget = () => {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = () => {

        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    }

    let ctrlAddItem = () => {
        let input, newItem;
        // 1. Get the field input data
        input = UICtrl.getinput();


        if(input.description !== "" && !isNaN(input.value) && input.value > 0 ) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
    
            // 4. clear the fields
            UICtrl.clearFields();
    
            // 5.calculate and update budget
            updateBudget();

            // 6. calculate and update percentages
            updatePercentages();
        }
    };

    let ctrlDeleteItem = event => {
        let itemId = event.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemId) {
            // inc-1
            let splitId = itemId.split('-');
            let type = splitId[0];
            let ID = parseInt(splitId[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from the ui
            UICtrl.deleteListItem(itemId);

            // 3. update and show the new budget
            updateBudget();

            // 4. calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: () => {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                }
            );
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();