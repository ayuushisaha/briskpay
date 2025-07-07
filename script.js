// Carousel Logic
let currentCardIndex = 0;
const cardCarousel = document.getElementById('cardCarousel');
const cardItems = document.querySelectorAll('.card-carousel-item');
const prevCardBtn = document.getElementById('prevCard');
const nextCardBtn = document.getElementById('nextCard');

/**
 * Scrolls the card carousel to the currentCardIndex.
 */
function updateCarouselScroll() {
    if (cardItems.length === 0) return;

    // Calculate the scroll position for the current card
    // This calculation attempts to center the card in the view.
    const targetCard = cardItems[currentCardIndex];
    const scrollLeftPosition = targetCard.offsetLeft - (cardCarousel.offsetWidth - targetCard.offsetWidth) / 2;

    // Smooth scroll to the calculated position
    cardCarousel.scrollTo({
        left: scrollLeftPosition,
        behavior: 'smooth'
    });
}

// Event listener for the previous card button
prevCardBtn.addEventListener('click', () => {
    // Decrement index, loop to the end if at the beginning
    currentCardIndex = (currentCardIndex > 0) ? currentCardIndex - 1 : cardItems.length - 1;
    updateCarouselScroll(); // Update carousel position
});

// Event listener for the next card button
nextCardBtn.addEventListener('click', () => {
    // Increment index, loop to the beginning if at the end
    currentCardIndex = (currentCardIndex < cardItems.length - 1) ? currentCardIndex + 1 : 0;
    updateCarouselScroll(); // Update carousel position
});

// Event listener for window resize
window.addEventListener('resize', () => {
    currentCardIndex = 0; // Reset index on resize to prevent weird positions
    updateCarouselScroll(); // Update carousel position after resize
});

// Initial update when the window loads to set the correct position
window.addEventListener('load', updateCarouselScroll);

// Intersection Observer for animations
// Select all elements that have animation classes
const animateElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in-left, .animate-slide-in-right');

// Create a new Intersection Observer instance
const observer = new IntersectionObserver((entries) => {
    // Loop through each entry (element being observed)
    entries.forEach(entry => {
        // If the element is intersecting (visible in the viewport)
        if (entry.isIntersecting) {
            entry.target.classList.add('animated'); // Add a class to trigger the animation
            observer.unobserve(entry.target); // Stop observing once the animation is triggered
        }
        // Ensure animations are applied on load if elements are already in view
        // This handles elements that are visible on page load without scrolling
        if (entry.intersectionRatio > 0) {
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.1 }); // Trigger when 10% of the element is visible

// Observe each animateable element
animateElements.forEach(element => {
    observer.observe(element);
});

// Optional: Swipe Support on Touch Devices for the carousel
let startX = 0;
let isSwiping = false;
let currentScrollLeft = 0; // To store initial scroll position for touchmove

cardCarousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentScrollLeft = cardCarousel.scrollLeft; // Store current scroll position
    isSwiping = true;
});

cardCarousel.addEventListener('touchmove', (e) => {
    if (!isSwiping) return; // Only proceed if a swipe has started
    // Calculate the distance moved and apply it to scrollLeft
    const walk = (e.touches[0].clientX - startX); // Positive if moving right, negative if moving left
    cardCarousel.scrollLeft = currentScrollLeft - walk; // Scroll in opposite direction of finger movement
});

cardCarousel.addEventListener('touchend', () => {
    isSwiping = false; // Reset swipe state when touch ends, regardless of movement
    // When touch ends, the browser's scroll-snap-type will handle the final snapping.
});
