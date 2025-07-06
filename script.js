// Carousel Logic
let currentCardIndex = 0;
const cardCarousel = document.getElementById('cardCarousel');
const cardItems = document.querySelectorAll('.card-carousel-item');
const prevCardBtn = document.getElementById('prevCard');
const nextCardBtn = document.getElementById('nextCard'); // Corrected this line

/**
 * Updates the position of the card carousel based on the currentCardIndex.
 * Calculates item width including margins for accurate translation.
 */
function updateCarousel() {
    // Get the actual rendered width of a single card item
    const itemWidth = cardItems[0].getBoundingClientRect().width;
    // Determine the total width to translate, accounting for margin between items.
    // Tailwind's `margin-right: 1rem` (16px) is applied to each card,
    // so we add this to the itemWidth for accurate translation.
    // For mobile, the margin is handled by `margin: 0 10%` which centers the card,
    // so we don't add extra margin for calculation in that case.
    const totalItemWidth = itemWidth + (window.innerWidth >= 768 ? 16 : 0); // Add 16px for desktop margin

    // Ensure currentCardIndex stays within valid bounds (0 to last item index)
    currentCardIndex = Math.min(currentCardIndex, cardItems.length - 1);
    currentCardIndex = Math.max(currentCardIndex, 0);

    // Apply the transform to move the carousel
    cardCarousel.style.transform = `translateX(-${currentCardIndex * totalItemWidth}px)`;
}

// Event listener for the previous card button
prevCardBtn.addEventListener('click', () => {
    // Decrement index, loop to the end if at the beginning
    currentCardIndex = (currentCardIndex > 0) ? currentCardIndex - 1 : cardItems.length - 1;
    updateCarousel(); // Update carousel position
});

// Event listener for the next card button
nextCardBtn.addEventListener('click', () => {
    // Increment index, loop to the beginning if at the end
    currentCardIndex = (currentCardIndex < cardItems.length - 1) ? currentCardIndex + 1 : 0;
    updateCarousel(); // Update carousel position
});

// Event listener for window resize
window.addEventListener('resize', () => {
    currentCardIndex = 0; // Reset index on resize to prevent weird positions
    updateCarousel(); // Update carousel position after resize
});

// Initial update when the window loads to set the correct position
window.addEventListener('load', updateCarousel);

// Intersection Observer for animations
// Select all elements that have animation classes
const animateElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in-left, .animate-slide-in-right');

// Create a new Intersection Observer instance
const observer = new Intersection ((entries) => {
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

cardCarousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});

cardCarousel.addEventListener('touchmove', (e) => {
    if (!isSwiping) return; // Only proceed if a swipe has started
    const diffX = e.touches[0].clientX - startX; // Calculate horizontal movement
    
    // If the horizontal movement is significant enough to be considered a swipe
    if (Math.abs(diffX) > 50) { // 50 pixels threshold for a swipe
        if (diffX > 0) { // Swiping right (move to previous card)
            // Move to previous card, but stop at the first card (don't loop)
            currentCardIndex = Math.max(0, currentCardIndex - 1);
        } else { // Swiping left (move to next card)
            // Move to next card, but stop at the last card (don't loop)
            currentCardIndex = Math.min(cardItems.length - 1, currentCardIndex + 1);
        }
        updateCarousel(); // Update carousel position
        isSwiping = false; // Reset swipe state after handling the swipe
    }
});

cardCarousel.addEventListener('touchend', () => {
    isSwiping = false; // Reset swipe state when touch ends, regardless of movement
});
