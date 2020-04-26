let questions = []

const urlApi = 'https://opentdb.com/api.php?amount=15&category=11&difficulty=easy&type=multiple'

let numberOfquestions = questions.length

let currentQuestion = 0

let question = {}

let answers = []

let points = 0;

const modal = document.querySelector('.modal')

const closeButton =  document.querySelector('.close-modal')

const pointsPainel = document.querySelector('#points')

const questionQuote = document.querySelector('#question-quote')

const anwerZero = document.querySelector('#anwer-zero')

const anwerOne = document.querySelector('#anwer-one')

const anwerTwo = document.querySelector('#anwer-two')

const anwerThree = document.querySelector('#anwer-three')

const nextButton = document.querySelector('#next')

const previousButton = document.querySelector('#previous')

const currentQuestionElement = document.querySelector('#current-question')

const numberOfQuestionsElement = document.querySelector('#number-of-questions')

const anwerListElement = document.querySelector('div.list-group')

const form = document.querySelector('form')

const finishButton = document.querySelector('a#finish')

const fetchQuestions = async () => {

  const response = await fetch(urlApi)

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

    anwerZero.innerHTML = question.incorrect_answers[0]
    anwerOne.innerHTML = question.incorrect_answers[1]
    anwerTwo.innerHTML = question.incorrect_answers[2]
    anwerThree.innerHTML = question.incorrect_answers[3]

    currentQuestionElement.textContent = currentQuestion + 1   

    numberOfQuestionsElement.textContent = numberOfquestions


}

const goTo = questionIndex =>{

  question = questions[questionIndex]

  currentQuestion = questionIndex

  render()
}

const showModal = (message, error) => {

    modal.querySelector('.modal-body').textContent = message

    if(error){

      modal.querySelector('.modal-header').classList.add('bg-danger')
      modal.querySelector('.modal-body').classList.add('bg-danger')
      modal.querySelector('.modal-footer').classList.add('bg-danger')

      modal.querySelector('.modal-title').innerHTML = `<i class="fa fa-exclamation fa-fw"></i> Errou!`

    }else{

      modal.querySelector('.modal-header').classList.add('bg-success')
      modal.querySelector('.modal-body').classList.add('bg-success')
      modal.querySelector('.modal-footer').classList.add('bg-success')

      modal.querySelector('.modal-title').innerHTML = `<i class="fa fa-check fa-fw"></i> Acertou!`

    }

    modal.setAttribute('style', 'display:block')

    if(error){

      modal.classList.add('ahashakeheartache')
    }
   
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

finishButton.addEventListener('click', event => {

  event.preventDefault()

  const mensagem = `Parabens! Você finalizou o Quizz`

  showModal(mensagem, false)

  form.reset()

  fetchQuestions()

  return

})

nextButton.addEventListener('click', event =>{

    event.preventDefault()

    if(currentQuestion + 1 < numberOfquestions){

      const questionIndex = currentQuestion + 1

      goTo(questionIndex)

      return
    }

})

previousButton.addEventListener('click', event =>{

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

form.addEventListener('submit', event => {

    event.preventDefault()

    questions[currentQuestion].selectedAnswerIndex = Number(event.target.a.value)

    const resposta = question.incorrect_answers[event.target.a.value]

    if(resposta === question.correct_answer){

        showModal(`Right answer, ${question.correct_answer}`, false)

        points =+ 10

    }else{

        showModal(` Wrong! The correct answer is ${question.correct_answer}.`, true)
    }

    event.target.reset()

    goTo(currentQuestion + 1)

})


const boot = (questionsData) => {

  questions = questionsData.results

  render()

}


fetchQuestions()