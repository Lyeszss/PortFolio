// Simplification de l'initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Animation du texte
    const textAnimation = new SplitType('.animate-text', {
        types: 'words, chars',
        absolute: true
    });

    gsap.from(textAnimation.chars, {
        duration: 0.8,
        y: 100,
        opacity: 0,
        stagger: 0.02,
        ease: "back.out"
    });

    // Observer pour les animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach((elem) => observer.observe(elem));

    // Initialiser le carousel et autres fonctionnalités
    initCarousel();
    displayGitHubFiles();
});

// Animation au scroll pour la section À propos
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Appel initial 

// Mise à jour du gestionnaire d'événements
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des tabs
    const tabs = document.querySelectorAll('.tab');
    const projectPreviews = document.querySelectorAll('.project-preview');
    const projectContents = document.querySelectorAll('.project-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const projectId = tab.getAttribute('data-project');
            
            // Mise à jour des tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mise à jour des previews
            projectPreviews.forEach(preview => preview.classList.remove('active'));
            document.getElementById(`${projectId}-preview`).classList.add('active');
            
            // Mise à jour du contenu
            projectContents.forEach(content => content.classList.remove('active'));
            document.getElementById(projectId).classList.add('active');
        });
    });
});

// Mise à jour de la gestion du carousel
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const items = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.indicator');
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');
        let currentIndex = 0;

        function showItem(index) {
            items.forEach(item => {
                item.style.display = 'none';
                item.style.opacity = '0';
            });
            indicators.forEach(ind => ind.classList.remove('active'));
            
            items[index].style.display = 'block';
            items[index].style.opacity = '1';
            indicators[index].classList.add('active');
            currentIndex = index;
        }

        function nextItem() {
            let next = currentIndex + 1;
            if (next >= items.length) next = 0;
            showItem(next);
        }

        function prevItem() {
            let prev = currentIndex - 1;
            if (prev < 0) prev = items.length - 1;
            showItem(prev);
        }

        // Event listeners
        if (prevButton) prevButton.addEventListener('click', prevItem);
        if (nextButton) nextButton.addEventListener('click', nextItem);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => showItem(index));
        });

        // Initialisation
        showItem(0);
    });
}

// Mise à jour de la fonction d'envoi d'email
function sendEmail(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Envoi en cours...</span>';
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "djlyes94@gmail.com"
    })
    .then(
        function(response) {
            submitBtn.innerHTML = '<span>Message envoyé !</span>';
            document.getElementById('contactForm').reset();
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Envoyer</span><i class="fas fa-paper-plane"></i>';
            }, 3000);
        },
        function(error) {
            submitBtn.innerHTML = '<span>Erreur</span>';
            alert("Une erreur s'est produite. Veuillez réessayer.");
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Envoyer</span><i class="fas fa-paper-plane"></i>';
            }, 3000);
        }
    );
}

// Mise à jour de la fonction displayGitHubFiles
function displayGitHubFiles() {
    const githubRepoUrl = 'https://github.com/Lyeszss/PortFolio';
    const filesContainer = document.querySelector('.github-files');
    
    if (!filesContainer) return;
    
    // Mise à jour de la liste complète des fichiers
    const portfolioFiles = [
        { name: 'index.html', path: 'index.html' },
        { name: 'styles.css', path: 'assets/css/styles.css' },
        { name: 'main.js', path: 'assets/js/main.js' },
        { name: 'animations.css', path: 'assets/css/animations.css' },
        { name: 'projects.js', path: 'assets/js/projects.js' },
        { name: 'contact.js', path: 'assets/js/contact.js' },
        // Ajoutez ici tous les fichiers de votre dépôt
    ];

    // Vérification de l'existence des fichiers via l'API GitHub
    fetch(`https://api.github.com/repos/Lyeszss/PortFolio/contents`)
        .then(response => response.json())
        .then(data => {
            const filesList = document.createElement('div');
            filesList.classList.add('files-list');

            // Filtrer et afficher uniquement les fichiers qui existent
            data.forEach(file => {
                const fileLink = document.createElement('a');
                fileLink.href = file.html_url; // Lien direct vers le fichier sur GitHub
                fileLink.target = '_blank';
                fileLink.classList.add('github-file-link');
                fileLink.innerHTML = `
                    <div class="file-info">
                        <i class="fab fa-github"></i>
                        <span class="file-name">${file.name}</span>
                    </div>
                    <i class="fas fa-external-link-alt"></i>
                `;
                filesList.appendChild(fileLink);
            });

            const githubHeader = document.createElement('div');
            githubHeader.classList.add('github-header');
            githubHeader.innerHTML = `
                <h3>Code Source</h3>
                <a href="${githubRepoUrl}" target="_blank" class="repo-link">
                    <i class="fab fa-github"></i>
                    Voir le dépôt complet
                </a>
            `;

            filesContainer.innerHTML = ''; // Nettoie le conteneur
            filesContainer.appendChild(githubHeader);
            filesContainer.appendChild(filesList);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des fichiers:', error);
            filesContainer.innerHTML = `
                <div class="error-message">
                    <p>Impossible de charger les fichiers. Visitez directement le <a href="${githubRepoUrl}" target="_blank">dépôt GitHub</a>.</p>
                </div>
            `;
        });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Gestion de la navigation entre les projets
document.addEventListener('DOMContentLoaded', function() {
    const projectButtons = document.querySelectorAll('.project-select-btn');
    const projectViews = document.querySelectorAll('.project-view');
    
    // Fonction pour afficher un projet
    function showProject(projectId) {
        // Cacher tous les projets
        projectViews.forEach(view => {
            view.classList.remove('active');
        });
        
        // Afficher le projet sélectionné
        const selectedView = document.getElementById(`${projectId}-view`);
        if (selectedView) {
            selectedView.classList.add('active');
        }
        
        // Mettre à jour les boutons
        projectButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-project') === projectId) {
                btn.classList.add('active');
            }
        });
    }
    
    // Gestionnaire d'événements pour les boutons
    projectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const projectId = button.getAttribute('data-project');
            showProject(projectId);
        });
    });
    
    // Afficher le projet Power BI par défaut au chargement
    showProject('powerbi');
});

// Ajouter cette fonction pour gérer le carousel
function initializeCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;

    // Fonction pour afficher une image spécifique
    function showImage(index) {
        // Masquer toutes les images
        items.forEach(item => item.classList.remove('active'));
        
        // Afficher l'image sélectionnée
        items[index].classList.add('active');
    }

    // Événement pour l'image suivante
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        showImage(currentIndex);
    });

    // Événement pour l'image précédente
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showImage(currentIndex);
    });

    // Afficher la première image au chargement
    showImage(0);
}

// Initialiser le carousel quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    // ... votre code existant ...
});

// Ajouter à la fin du fichier main.js
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    
    // Fonction pour ouvrir la modal
    function openModal(imageSrc) {
        modalImg.src = imageSrc;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
    
    // Fonction pour fermer la modal
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    // Ajouter les événements click sur les images
    document.querySelectorAll('.carousel-item img').forEach(img => {
        img.addEventListener('click', function() {
            openModal(this.src);
        });
    });
    
    // Fermer la modal avec le bouton
    closeBtn.addEventListener('click', closeModal);
    
    // Fermer la modal en cliquant en dehors de l'image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fermer la modal avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
});

// Ajoutez ce code à votre fichier main.js existant
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner toutes les images avec la classe zoomable-image
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    
    zoomableImages.forEach(image => {
        image.addEventListener('click', function() {
            // Créer la modal dynamiquement
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            const modalImage = document.createElement('img');
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            
            const closeButton = document.createElement('button');
            closeButton.className = 'close-modal';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            
            modalContent.appendChild(modalImage);
            modalContent.appendChild(closeButton);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Afficher la modal avec animation
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Empêcher le scroll du body
            document.body.style.overflow = 'hidden';
            
            // Fonction de fermeture
            const closeModal = () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = 'auto';
                }, 300);
            };
            
            // Événements de fermeture
            closeButton.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Fermeture avec Echap
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        });
    });
});

// Ajouter ce code pour la gestion de la navigation
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du scroll pour le header
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;

    // Fonction pour gérer l'apparence du header au scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Gestion des liens actifs
    function setActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Écouter le scroll pour mettre à jour le lien actif
    window.addEventListener('scroll', setActiveLink);
    
    // Animation douce pour le scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}); 