let currentQuizIndex = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;
let quizzes = [];

// ページ読み込み時にクイズデータを取得
document.addEventListener('DOMContentLoaded', () => {
    loadQuizzes();
    setupEventListeners();
});

// クイズデータの読み込み
async function loadQuizzes() {
    try {
        const response = await fetch('quiz-data.json');
        const data = await response.json();
        quizzes = data.quizzes;
        displayQuiz();
    } catch (error) {
        console.error('クイズデータの読み込みに失敗しました:', error);
        document.querySelector('.question').textContent = 'データの読み込みに失敗しました';
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    document.getElementById('btn-next').addEventListener('click', nextQuiz);
    document.getElementById('btn-restart').addEventListener('click', restartQuiz);
}

// クイズの表示
function displayQuiz() {
    if (currentQuizIndex >= quizzes.length) {
        showResult();
        return;
    }

    const quiz = quizzes[currentQuizIndex];
    answered = false;
    selectedAnswer = null;

    // 質問の表示
    document.getElementById('question').textContent = quiz.question;

    // 選択肢の表示
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    quiz.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionDiv);
    });

    // フィードバックのリセット
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('explanation').style.display = 'none';

    // ボタンの状態をリセット
    document.getElementById('btn-next').disabled = true;

    // プログレスバーの更新
    updateProgress();
}

// 選択肢の選択
function selectAnswer(index) {
    if (answered) return;

    selectedAnswer = index;
    const quiz = quizzes[currentQuizIndex];
    const options = document.querySelectorAll('.option');

    // 前の選択をクリア
    options.forEach(opt => opt.classList.remove('selected'));

    // 現在の選択をハイライト
    options[index].classList.add('selected');

    // ボタンを有効化
    document.getElementById('btn-next').disabled = false;
}

// 次の問題へ
function nextQuiz() {
    if (selectedAnswer === null) return;

    answered = true;
    const quiz = quizzes[currentQuizIndex];
    const options = document.querySelectorAll('.option');

    // 正解と不正解を表示
    if (selectedAnswer === quiz.answer) {
        options[selectedAnswer].classList.add('correct');
        showFeedback('正解！', true);
        score++;
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[quiz.answer].classList.add('correct');
        showFeedback('不正解...', false);
    }

    // 説明があれば表示
    if (quiz.explanation) {
        const explanationDiv = document.getElementById('explanation');
        explanationDiv.textContent = quiz.explanation;
        explanationDiv.style.display = 'block';
    }

    // ボタンのテキストを変更
    const btnNext = document.getElementById('btn-next');
    if (currentQuizIndex === quizzes.length - 1) {
        btnNext.textContent = '結果を見る';
    } else {
        btnNext.textContent = '次へ';
    }

    // 次の問題を設定
    currentQuizIndex++;
}

// フィードバックの表示
function showFeedback(message, isCorrect) {
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.textContent = message;
    feedbackDiv.className = `feedback active ${isCorrect ? 'correct' : 'incorrect'}`;
}

// プログレスバーの更新
function updateProgress() {
    const progress = ((currentQuizIndex + 1) / quizzes.length) * 100;
    document.querySelector('.progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `${currentQuizIndex + 1} / ${quizzes.length}`;
}

// 結果の表示
function showResult() {
    const percentage = Math.round((score / quizzes.length) * 100);

    document.querySelector('.quiz-container').classList.remove('active');
    document.querySelector('.result-container').classList.add('active');

    document.getElementById('final-score').textContent = `${score} / ${quizzes.length}`;

    let message = '';
    if (percentage === 100) {
        message = '完璧です！🎉 すべての問題に正解しました！';
    } else if (percentage >= 80) {
        message = 'よくできました！ 👍 もう少しで完璧です！';
    } else if (percentage >= 60) {
        message = 'まあまあですね。 もう一度挑戦してみましょう！';
    } else {
        message = '頑張りましょう！ 📚 もう一度復習して挑戦してください！';
    }

    document.getElementById('result-message').textContent = message;
}

// クイズをリスタート
function restartQuiz() {
    currentQuizIndex = 0;
    selectedAnswer = null;
    answered = false;
    score = 0;

    document.querySelector('.quiz-container').classList.add('active');
    document.querySelector('.result-container').classList.remove('active');

    displayQuiz();
}
