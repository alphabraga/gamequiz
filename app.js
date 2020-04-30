let configuration = { 'difficulty' : 'easy', 'category': 11, 'numberOfQuestions': 10 }

const getUrlApi = ({numberOfQuestions , category, difficulty}) =>  `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`

let questions = []
let currentQuestion = 0
let question = {}
let answers = []
let points = 0

const resetQuiz = () => {

  form.reset()

  questions = []
  currentQuestion = 0
  question = {}
  answers = []
  points = 0

}

// selectors

const modal =                    document.querySelector('.modal')
const closeButton =              document.querySelector('.close-modal')
const modalConfig =              document.querySelector('#config-modal.modal')
const closeConfigButton =        document.querySelector('.close-config-modal')
const formConfig =               document.querySelector('form#config-form')
const pointsPainel =             document.querySelector('#points')
const questionQuote =            document.querySelector('#question-quote')
const anwerZero =                document.querySelector('#anwer-zero')
const anwerOne =                 document.querySelector('#anwer-one')
const anwerTwo =                 document.querySelector('#anwer-two')
const anwerThree =               document.querySelector('#anwer-three')
const nextButton =               document.querySelector('#next')
const previousButton =           document.querySelector('#previous')
const currentQuestionElement =   document.querySelector('#current-question')
const numberOfQuestionsElement = document.querySelector('#number-of-questions')
const anwerListElement =         document.querySelector('div.list-group')
const form =                     document.querySelector('form')
const finishButton =             document.querySelector('a#finish')
const configurationElement =     document.querySelector('a#configuracao')
const listGroupElement =         document.querySelector('div.list-group')

// end selectors

// functions

const configure = (difficulty, numberOfQuestions, category) => { 

  configuration = { difficulty, category, numberOfQuestions }

  return

 }

 const showModal = (message, error) => {

  modal.querySelector('.modal-body').textContent = message

  if(error){

    modal.querySelector('.modal-header').classList.add('bg-danger')
    modal.querySelector('.modal-body').classList.add('bg-danger')
    modal.querySelector('.modal-footer').classList.add('bg-danger')
    modal.querySelector('.modal-title').innerHTML = `<i class="fa fa-exclamation fa-fw"></i> You made a bad mistake!`

  }else{

    modal.querySelector('.modal-header').classList.add('bg-success')
    modal.querySelector('.modal-body').classList.add('bg-success')
    modal.querySelector('.modal-footer').classList.add('bg-success')
    modal.querySelector('.modal-title').innerHTML = `<i class="fa fa-check fa-fw"></i> Congratulations!`

  }

  modal.setAttribute('style', 'display:block')

  if(error){

    modal.classList.add('ahashakeheartache')
  }
 
}

const fetchQuestions = async () => {

  resetQuiz()

  const response = await fetch(getUrlApi(configuration))
  const data = await response.json()
 
  boot(data)
}

const render = () => {

    form.reset()

    pointsPainel.textContent = points
    question = questions[currentQuestion]
    questionQuote.innerHTML = question.question 
    anwerZero.innerHTML = question.correct_answer
    question.incorrect_answers = [question.correct_answer, ...question.incorrect_answers]

    newQuestionsOrder = question.incorrect_answers.sort( (a, b) => {

      if(a < b) { return -1; }

      if(a > b) { return 1; }

      return 0;

    } )

    question.incorrect_answers = newQuestionsOrder

    anwerZero.innerHTML  = question.incorrect_answers[0]
    anwerOne.innerHTML   = question.incorrect_answers[1]
    anwerTwo.innerHTML   = question.incorrect_answers[2]
    anwerThree.innerHTML = question.incorrect_answers[3]

    currentQuestionElement.textContent = currentQuestion + 1   

    numberOfQuestionsElement.textContent = configuration.numberOfQuestions


}

const goTo = questionIndex =>{


  question = questions[currentQuestion]
  currentQuestion = questionIndex

  render()
}



const closeModal = () => {

  modal.setAttribute('style', 'display:hide')

  modal.querySelector('.modal-header').classList.remove('bg-danger')
  modal.querySelector('.modal-body').classList.remove('bg-danger')
  modal.querySelector('.modal-footer').classList.remove('bg-danger')
  modal.querySelector('.modal-header').classList.remove('bg-success')
  modal.querySelector('.modal-body').classList.remove('bg-success')
  modal.querySelector('.modal-footer').classList.remove('bg-success')
  modal.querySelector('.modal-title').innerHTML = ''

  modal.classList.remove('ahashakeheartache')

  modal.querySelector('.modal-body').textContent = null

}

const showModalConfig = () => {

  formConfig.difficulty.value = configuration.difficulty
  formConfig.category.value = configuration.category
  formConfig.numberOfQuestions.value = configuration.numberOfQuestions

  modalConfig.setAttribute('style', 'display:block')
 
}

const closeModalConfig = () => {

  modalConfig.setAttribute('style', 'display:hide')

}

const finishQuiz = () => {

  console.log('O jogo acababou... vamos reiniciar')

  fetchQuestions()

}


const boot = (questionsData) => {

  questions = questionsData.results

  render()

}

// end functions 


// listeners

listGroupElement.addEventListener('click', event => {

  const selectedOption = document.querySelector(`[data-js="${event.target.dataset.js}"]`)
  const allOptions     = document.querySelectorAll('div.list-group a')

  allOptions.forEach( option => option.classList.remove('active') )

  selectedOption.classList.toggle('active')
  
  const radio =  selectedOption.querySelector('input')

  radio.checked = true

})

formConfig.addEventListener('submit', event => {

  event.preventDefault()

  configure(event.target.difficulty.value, event.target.numberOfQuestions.value, event.target.category.value)

  fetchQuestions()
  closeModalConfig()

  return 

})

configurationElement.addEventListener('click', event =>{

  event.preventDefault()

  showModalConfig()



})


finishButton.addEventListener('click', event => {

  event.preventDefault()

  finishQuiz()

  return

})

nextButton.addEventListener('click', event =>{

  event.preventDefault()

  if(currentQuestion + 1 < configuration.numberOfQuestions){

    const questionIndex = currentQuestion + 1

    goTo(questionIndex)

    return
  }

})

previousButton.addEventListener('click', event => {

    event.preventDefault()

    if(currentQuestion - 1 >= 0){

      const questionIndex = currentQuestion - 1

      goTo(questionIndex)

      return
    }

})

closeButton.addEventListener('click', event => {

    event.preventDefault()

    closeModal()

})

closeConfigButton.addEventListener('click', event => {

  event.preventDefault()

  closeModalConfig()

})

form.addEventListener('submit', event => {

    event.preventDefault()

    questions[currentQuestion].selectedAnswerIndex = Number(event.target.a.value)

    const resposta = question.incorrect_answers[event.target.a.value]

    if(resposta === question.correct_answer){

      showModal(`Right answer, ${question.correct_answer}.`, false)
      points =+ 10

    }else{

      showModal(` Wrong! The correct answer is ${question.correct_answer}.`, true)
    }

    event.target.reset()

    if( currentQuestion + 1 < configuration.numberOfQuestions ){

      goTo(currentQuestion + 1)

    }else{

      finishQuiz()

    }


})

// end listeners


fetchQuestions()