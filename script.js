document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, 2000);

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Scroll to section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Initialize Swiper gallery
    const gallerySwiper = new Swiper('.gallery-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Countdown timer
    function updateCountdown() {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        const diff = nextMonth - today;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Music player functionality
    const musicPlayer = document.querySelector('.music-player');
    const playBtn = document.querySelector('.play-btn');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    // Mock music data
    const songs = [
        {
            title: 'Nossa Música',
            artist: 'Artista',
            duration: '3:45',
            playing: true
        },
        {
            title: 'Música do Primeiro Beijo',
            artist: 'Artista',
            duration: '4:12',
            playing: false
        },
        {
            title: 'Música do Coração',
            artist: 'Artista',
            duration: '3:30',
            playing: false
        }
    ];
    
    let isPlaying = false;
    
    playBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            musicPlayer.classList.add('playing');
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            // Simulate progress bar movement
            simulateProgress();
        } else {
            musicPlayer.classList.remove('playing');
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            clearInterval(progressInterval);
        }
    });
    
    let progressInterval;
    function simulateProgress() {
        let progress = 0;
        progressInterval = setInterval(() => {
            if (progress >= 100) {
                progress = 0;
                playNextSong();
            } else {
                progress += 0.5;
                progressBar.style.width = `${progress}%`;
                
                // Update time display
                const duration = 225; // 3:45 in seconds
                const currentTime = (duration * progress) / 100;
                currentTimeEl.textContent = formatTime(currentTime);
            }
        }, 1000);
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Set initial duration
    durationEl.textContent = songs[0].duration;
    
    // Playlist functionality
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            playlistItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update player with selected song
            const song = songs[index];
            document.querySelector('.song-title').textContent = song.title;
            document.querySelector('.artist').textContent = song.artist;
            durationEl.textContent = song.duration;
            
            // Reset progress
            progressBar.style.width = '0%';
            currentTimeEl.textContent = '0:00';
            
            // If player was playing, continue with new song
            if (isPlaying) {
                clearInterval(progressInterval);
                simulateProgress();
            }
        });
    });
    
    function playNextSong() {
        const currentIndex = Array.from(playlistItems).findIndex(item => item.classList.contains('active'));
        const nextIndex = (currentIndex + 1) % playlistItems.length;
        playlistItems[nextIndex].click();
    }

    // Quiz functionality
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const progressBarQuiz = document.querySelector('.quiz-progress .progress-bar');
    const quizResult = document.querySelector('.quiz-result');
    const correctAnswersEl = document.getElementById('correct-answers');
    const resultMessageEl = document.getElementById('result-message');
    const retryBtn = document.querySelector('.retry-quiz');
    
    let currentQuestion = 0;
    let correctAnswers = 0;
    const correctOptions = [1, 1, 1]; // Index of correct options for each question (0-based)
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionIndex = parseInt(this.closest('.quiz-question').dataset.question);
            const optionIndex = Array.from(this.parentElement.children).indexOf(this);
            
            // Check if answer is correct
            if (optionIndex === correctOptions[questionIndex]) {
                correctAnswers++;
            }
            
            // Move to next question or show results
            if (questionIndex < quizQuestions.length - 1) {
                quizQuestions[questionIndex].classList.remove('active');
                quizQuestions[questionIndex + 1].classList.add('active');
                currentQuestion++;
                updateProgressBar();
            } else {
                showResults();
            }
        });
    });
    
    function updateProgressBar() {
        const progress = (currentQuestion / (quizQuestions.length - 1)) * 100;
        progressBarQuiz.style.width = `${progress}%`;
    }
    
    function showResults() {
        document.querySelector('.quiz-container').style.height = `${document.querySelector('.quiz-container').offsetHeight}px`;
        
        quizQuestions.forEach(q => q.classList.remove('active'));
        quizResult.classList.add('active');
        progressBarQuiz.style.width = '100%';
        
        correctAnswersEl.textContent = correctAnswers;
        
        // Set result message based on score
        const percentage = (correctAnswers / quizQuestions.length) * 100;
        let message = '';
        
        if (percentage >= 80) {
            message = 'Você me conhece perfeitamente! Nosso amor está além das palavras ❤️';
        } else if (percentage >= 50) {
            message = 'Você me conhece bem, mas ainda temos muito para descobrir um sobre o outro!';
        } else {
            message = 'Precisamos passar mais tempo juntos para você me conhecer melhor!';
        }
        
        resultMessageEl.textContent = message;
    }
    
    retryBtn.addEventListener('click', function() {
        currentQuestion = 0;
        correctAnswers = 0;
        
        quizQuestions.forEach((q, index) => {
            q.classList.remove('active');
            if (index === 0) q.classList.add('active');
        });
        
        quizResult.classList.remove('active');
        progressBarQuiz.style.width = '0%';
        document.querySelector('.quiz-container').style.height = 'auto';
    });

    // Confetti button
    const confettiBtn = document.getElementById('confettiBtn');
    
    confettiBtn.addEventListener('click', function() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#ff758f', '#ffccd5', '#ffffff']
        });
        
        // Create floating hearts
        for (let i = 0; i < 20; i++) {
            createFloatingHeart();
        }
    });
    
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.color = `hsl(${Math.random() * 60 + 340}, 100%, 70%)`;
        heart.style.opacity = '0';
        heart.style.transition = 'opacity 0.5s ease';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.style.opacity = '1';
            
            const animationDuration = Math.random() * 3 + 2;
            heart.style.animation = `float-up ${animationDuration}s ease-out forwards`;
            
            setTimeout(() => {
                heart.remove();
            }, animationDuration * 1000);
        }, 100);
    }
    
    // Add float-up animation for confetti hearts
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Typewriter effect for love letter
    const letterParagraphs = document.querySelectorAll('.letter-content p');
    letterParagraphs.forEach((p, index) => {
        const originalText = p.textContent;
        p.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typingEffect = setInterval(() => {
                if (i < originalText.length) {
                    p.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typingEffect);
                }
            }, 30);
        }, index * 2000);
    });

    // Memory cards animation
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.5s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + index * 200);
    });

    // Click heart effect
    document.addEventListener('click', function(e) {
        if (e.target === confettiBtn || confettiBtn.contains(e.target)) return;
        
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.color = `hsl(${Math.random() * 60 + 340}, 100%, 70%)`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'float-heart 2s ease-out forwards';
        heart.style.zIndex = '1000';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    });

    // Add animation for click hearts
    const clickHeartStyle = document.createElement('style');
    clickHeartStyle.textContent = `
        @keyframes float-heart {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 50 + 20}px, -100px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(clickHeartStyle);
});
