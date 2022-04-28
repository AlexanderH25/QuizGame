        /* QUIZ CONTROLER */

//quizController - working on data
var quizController = (function() {
 
    /*QUESTION CONSTRUCTOR*/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    //SETTING UP THE LOCAL STORAGE
    var questionLocalStorage = {
        //questionCollection it is an array which stores question objects from Question Constructor
        setQuestionCollection: function(newCollection) {
            localStorage.setItem('QuestionCollection', JSON.stringify(newCollection));
        }, 
        getQuestionCollection: function() { 
                return JSON.parse(localStorage.getItem('QuestionCollection'));
        },
        removeQuestionCollection: function() {
            localStorage.removeItem('QuestionCollection');
        }
    }

        if(questionLocalStorage.getQuestionCollection() === null) {
            questionLocalStorage.setQuestionCollection([]);
        }

        var quizProgress = {
            questionIndex: 0
        }

        /* PERSON CONTRUCTOR */
        function Person(id, firstname, lastname, score) {
            this.id = id;
            this.firstname = firstname;
            this.lastname = lastname;
            this.score = score;
        }

        var currentPersonData = {
            fullname: [],
            score: 0
        }

        var adminFullName = ['Mark', 'Mark'];

        var personLocalStorage = {
            setPersonData: function(newPersonData) {
                localStorage.setItem('personData', JSON.stringify(newPersonData));
            },
            getPersonData: function() {
                return JSON.parse(localStorage.getItem('personData'));
            },

            removePersonData: function(){
                localStorage.removeItem('personData');
            }
        }

        if(personLocalStorage.getPersonData() === null) {
            personLocalStorage.setPersonData([]);
        }

    return {

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function(newQuestionText, options) {

            var optionsArr, corrAns, questionId, newQuestion, getStoredQuestions, isChecked;

            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            
            optionsArr = [];
            isChecked = false;

            for(var i = 0; i < options.length; i++) {

                if(options[i].value !== "") {
                    optionsArr.push(options[i].value);
                }

                if (options[i].previousElementSibling.checked && options[i].value !== "") {
                    corrAns = options[i].value;
                    isChecked = true;
                };
                
                if(questionLocalStorage.getQuestionCollection().length > 0) {
                   questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
                } else {
                    questionId = 0;
                }

            }

            console.log('obj', questionLocalStorage.getQuestionCollection());

            if(newQuestionText.value !== "") {
                if(optionsArr.length > 1) {
                    if(isChecked) {
                        //Creating questions from the Question Constructor
                        newQuestion = new Question (questionId, newQuestionText.value, optionsArr, corrAns);

                        //getting the data from the local storage
                        getStoredQuestions = questionLocalStorage.getQuestionCollection();
                        console.log('AFTER DECLARATION', getStoredQuestions); 

                        getStoredQuestions.push(newQuestion); 

                        //push the information in the local storage
                        questionLocalStorage.setQuestionCollection(getStoredQuestions);

                        newQuestionText.value = '';

                        Array.from(options).forEach(function(opts) {
                            opts.value = '';
                            opts.previousElementSibling.checked = false;
                        });

                        return true;

                    } else {
                        alert('You missed to check correct answer, or you checked answer without value');
                        return false;
                    }
                } else {
                    alert('You must insert at least two options');
                    return false;
                }
            } else {
                alert('Please Insert Question');
                return false;
            }
        },

        checkAnswer: function(ans) {
            //Getting from the local storage correct answer and check if it's true
            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
                
                currentPersonData.score++;
                
                return true;
            } else {
                return false;
            }

        },

        isFinished: function() {
            console.log(quizProgress.questionIndex)
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;

        },

        addPerson: function() {
            var newPerson, personId, personData;

            if(personLocalStorage.getPersonData().length > 0) {

                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;

            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currentPersonData.fullname[0], currentPersonData.fullname[1], currentPersonData.score);
            personData = personLocalStorage.getPersonData();
        
            personData.push(newPerson);
            personLocalStorage.setPersonData(personData);

            console.log(newPerson);
        },

        getCurrPersonData: currentPersonData,
        
        getAdminFullName: adminFullName,

        getPersonLocalStorage: personLocalStorage
        

    };
})();


        /* UI CONTROLER */
//it works with data which will appear on user interface and this will be managed by UIcontroller
//UIController will receive data from quizController
 var UIController = (function() {
    
    //domItems is in closure 
    var domItems = {
        /* ADMIN PANEL ELEMENTS */
        questionInsertBtn: document.getElementById('questions-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        //because of closure adminOptions knows only two inputs which are in the HTML and didn't get the value from the newly created elements.
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector('.admin-options-container'),
        insertedQuestionWrapper: document.querySelector('.inserted-questions-wrapper'),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionClearBtn: document.getElementById('questions-clear-btn'),
        resultsClearBtn: document.getElementById('results-clear-btn'),
        /*  QUIZ SECTION ELEMENTS */
        askedQuestText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressPar: document.getElementById('progress'),
        instantAnswerContainer: document.querySelector('.instant-answer-container'),
        instAnsText: document.getElementById('instant-answer-text'),
        insAnsDiv:document.getElementById('instant-answer-wrapper'),
        nextQuestBtn: document.getElementById('next-question-btn'),
        resultListWrapper: document.querySelector('.results-list-wrapper'),
        /* LANDING PAGE ELEMENTS */
        adminPanelSection: document.querySelector('.admin-panel-container'),
        landingPageSection: document.querySelector('.landing-page-container'),
        quizSection: document.querySelector('.quiz-container'),
        startQuizBtn:document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        /* Final Result Section Elements */
        finalResultSection: document.querySelector('.final-result-container'),
        finalScoreText: document.getElementById('final-score-text'),


    }

    return {
        getDomItems: domItems,
        
        addInputsDynamically: function() {
            var addInput = function() {

                var inputHTML, counter;

                //counter increments by 1 on every new created input in the nodeList
                counter = document.querySelectorAll('.admin-option').length;
                

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + counter + ' " name="answer" value="'+ counter +'"><input type="text" class="admin-option admin-option-'+ counter +'" value=""></div>';
                //Add the inputHTML element in the div.admin-options-container
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        
            }

           domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
          
        },
        createQuestionList: function(getQuestions) {
            var questionHTML, numberArr;

            numberArr = [];

           domItems.insertedQuestionWrapper.innerHTML = '';

           for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                
                numberArr.push(i + 1)

                questionHTML = '<p><span>' + numberArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id +'">Edit</button></p>';
              
                domItems.insertedQuestionWrapper.insertAdjacentHTML('afterbegin', questionHTML); 
           }
        
        },

        editQuestionList: function(event, storageQuestionList, addInpsDynFn, updateQuestionListFn) {
            var getId, getStorageQuestionList, foundItem, placeInArr, optionHTML;

            if('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);
                
                getStorageQuestionList = storageQuestionList.getQuestionCollection();
                
                for(var i = 0; i < getStorageQuestionList.length; i++) {
                    
                    if(getStorageQuestionList[i].id === getId){

                        foundItem = getStorageQuestionList[i];

                        placeInArr = i;

                    }
                }

                domItems.newQuestionText.value = foundItem.questionText;
                
                domItems.adminOptionsContainer.innerHTML = '';

                optionHTML = '';

                for (var c = 0; c < foundItem.options.length; c++) {
                     optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + c + '" name="answer" value="1"><input type="text" class="admin-option admin-option-' + c + '" value="'+ foundItem.options[c] +'"></div>';
                }

                domItems.adminOptionsContainer.innerHTML = optionHTML;
                
                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questionClearBtn.style.pointerEvents = 'none';
            
                addInpsDynFn();

                
                var backDefaultView = function() {

                    var updatedOptions;
                    
                    domItems.newQuestionText.value = "";
                    updatedOptions = document.querySelectorAll("admin-option");

                    for(var i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.questionInsertBtn.style.visibility = 'visible';
                    domItems.questionClearBtn.style.pointerEvents = '';

                    updateQuestionListFn(storageQuestionList);
                }

                var updateQuestion = function() {
                    var newOptions, optionElements;

                    newOptions = [];

                    optionElements = document.querySelectorAll('.admin-option');

                    foundItem.questionText = domItems.newQuestionText.value;

                    foundItem.correctAnswer = ''

                    for(var i = 0; i < optionElements.length; i++) {
                        if(optionElements[i].value !== '') {
                            newOptions.push(optionElements[i].value);
                            if(optionElements[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionElements[i].value;
                            }

                        }
                    }

                    foundItem.options = newOptions;

                    if(foundItem.questionText !== '') {
                        if(foundItem.options.length > 1) {
                            if(foundItem.correctAnswer !== '') {
                                getStorageQuestionList.splice(placeInArr, 1, foundItem);
                                
                                storageQuestionList.setQuestionCollection(getStorageQuestionList);   

                                //Clears dynamically the list with questions
                                backDefaultView();

                            } else {
                                alert('You missed to check correct answer, or you checked answer without value');
                            }
                        } else {
                            alert('Please Insert At least 2 options');
                        }

                    } else {
                        alert('Please Insert Question');
                    }
                   
            
                   
                    

                }

                domItems.questionUpdateBtn.onclick = updateQuestion;

                var deleteQuestion = function() {
                    getStorageQuestionList.splice(placeInArr, 1);

                    storageQuestionList.setQuestionCollection(getStorageQuestionList);

                    backDefaultView();
                }

                domItems.questionDeleteBtn.onclick = deleteQuestion;

            }
        },

        clearQuestionList: function(storageQuestionList) {
           
            if(storageQuestionList.getQuestionCollection() !== null) {
                if(storageQuestionList.getQuestionCollection().length > 0) {
                    var conf = confirm('Warning! You will clear the entire question list');
                    
                    if(conf) {
                        storageQuestionList.removeQuestionCollection();

                        domItems.insertedQuestionWrapper.innerHTML = "";
                    }

                }
            }

        },

        displayQuestion: function(storageQuestionList, progress) {
            
            var newOptionHTML, characterArr;

            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

            if(storageQuestionList.getQuestionCollection().length > 0) {
                domItems.askedQuestText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;
                
                domItems.quizOptionsWrapper.innerHTML = '';
              
                // loop through local storage object options array
                 for(var i = 0; i < storageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p class="choice-' + i + '">' + storageQuestionList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';

                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);

                 };
            }
        },

        displayProgress: function(storageQuestionList, progress) {
                
            domItems.progressBar.max = storageQuestionList.getQuestionCollection().length;

            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestionList.getQuestionCollection().length;
        },

        newDesign: function(ansResult, selectedAnswer) {
            
            var twoOptions, index;

            index = 0;

            if (ansResult) {
                index = 1;
            }

            twoOptions = {
                instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                instAnswerClass: ['red', 'green'],
                optionsSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            };

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none";

            domItems.instantAnswerContainer.style.opacity = "1";
            
            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
            
            domItems.insAnsDiv.className = twoOptions.instAnswerClass[index];

            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionsSpanBg[index];
            
        },

        resetDesign: function() {

            domItems.quizOptionsWrapper.style.cssText = "";

            domItems.instantAnswerContainer.style.opacity = "0";
        },

        getFullName: function(currPerson, storageQuestList, admin) {
            if(domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {
                if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {

                if(storageQuestList.getQuestionCollection().length > 0) {

                    currPerson.fullname.push(domItems.firstNameInput.value);
                    currPerson.fullname.push(domItems.lastNameInput.value);

                    domItems.landingPageSection.style.display = 'none';

                    domItems.quizSection.style.display = 'block';

                    } else {
                        alert('Quiz is not ready, please contact to administrator');
                    }

                } else {
                    domItems.landingPageSection.style.display = 'none';
    
                    domItems.adminPanelSection.style.display = 'block';
                }
            } else {
                alert('Please enter your first name and last name');
            }
        },
        
        finalResult: function(currPerson) {

            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' + currPerson.score;

            domItems.quizSection.style.display = 'none';

            domItems.finalResultSection.style.display = 'block';
        },

        addResultOnPanel: function(userData) {
            var userPointsHTML, pointsArr;

            domItems.resultListWrapper.innerHTML = '';

            pointsArr = [];
        
            for(var i = 0; i < userData.getPersonData().length; i++) {
                console.log(userData.getPersonData()[i]);

                pointsArr.push(i + 1);

                userPointsHTML = '<p class="person person-' + pointsArr[i] + '"><span class="person-' + pointsArr[i] + '">' + userData.getPersonData()[i].firstname + ' ' + userData.getPersonData()[i].lastname + ' - ' +userData.getPersonData()[i].score + ' points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>'
                
                domItems.resultListWrapper.insertAdjacentHTML('afterbegin', userPointsHTML);
            }

        },
     
        //delete a certain question
        deleteResult: function(event, userData) {
            var getId, personsArr;

            personsArr = userData.getPersonData();


            if('delete-result-btn_'.indexOf(event.target.id)) {
                
                getId = parseInt(event.target.id.split('_')[1]);
                
                for (var i = 0; i < personsArr.length; i++) {
                    console.log(personsArr[i]); 
                    if(personsArr[i].id === getId) {

                        personsArr.splice(i, 1);

                        userData.setPersonData(personsArr);
                    }

                }

            }
        },
        //Clear the results in admin panel
        clearResultList: function(userData) {
            if(userData.getPersonData() !== null) {
                if(userData.getPersonData().length > 0) {

                    var conf = confirm('You will clear all the results!');

                    if(conf) {
                        userData.removePersonData();

                        domItems.resultListWrapper.innerHTML = ""
                    }

                }
            }
        }

    };

    
 })();

        /* CONTROLER */
//sending data from quiz module to user interface module
var controller = (function(quizCtrl, UICtrl) {
    var selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', function() {
        var adminOptions = document.querySelectorAll('.admin-option');
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);

        if(checkBoolean) {
            //If it's true this function will be invoked and new question will be created
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
        
   });

   //Insert Questions Button
   selectedDomItems.insertedQuestionWrapper.addEventListener('click', function(e) {
    UICtrl.editQuestionList(e, quizController.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
   });

   selectedDomItems.questionClearBtn.addEventListener('click', function() {
        //Clear Question Button
        UICtrl.clearQuestionList(quizController.getQuestionLocalStorage);
    
   });

   //Display Question Method
   UICtrl.displayQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
   //Display Progress Method
   UICtrl.displayProgress(quizController.getQuestionLocalStorage, quizController.getQuizProgress);

   selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {
       var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');
       
        for(var i = 0; i < updatedOptionsDiv.length; i++) {
           if(e.target.className === 'choice-' + i) {
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

                var answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                if(quizCtrl.isFinished()) {
                    selectedDomItems.nextQuestBtn.textContent = 'Finish';
                }

                var nextQuestion = function(questData, progress) {
                    if(quizCtrl.isFinished()) {
                        //Insert person score into local storage
                        quizCtrl.addPerson();

                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                        
                    } else {
                        //Next Question
                        UICtrl.resetDesign();
                        
                        quizCtrl.getQuizProgress.questionIndex++;

                        UICtrl.displayQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
                        
                        UICtrl.displayProgress(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
                    }
                  
                }

                selectedDomItems.nextQuestBtn.onclick = function() {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                }
           }
        }

   });

   selectedDomItems.startQuizBtn.addEventListener('click', function() {
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
   });

    selectedDomItems.lastNameInput.addEventListener('keypress', function(e) {
            
            if(e.keyCode === 13) {
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    selectedDomItems.resultListWrapper.addEventListener('click', function(e) {
        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);

        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });

    selectedDomItems.resultsClearBtn.addEventListener('click', function() {
        UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
    });


 })(quizController, UIController);