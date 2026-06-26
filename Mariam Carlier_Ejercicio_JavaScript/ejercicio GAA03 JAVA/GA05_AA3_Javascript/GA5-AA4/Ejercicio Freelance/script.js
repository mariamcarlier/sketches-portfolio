<script>
    const carousel = document.querySelector('.carousel');
    const markers = document.querySelectorAll('.marker');


    carousel.addEventListener('wheel', (evt) => {
        if (evt.deltaY !== 0) {
            evt.preventDefault();
            carousel.scrollLeft += evt.deltaY;
        }
    }, { passive: false });

    
    carousel.addEventListener('scroll', () => {
   
        const index = Math.round(carousel.scrollLeft / (carousel.offsetWidth / 2));
        
        markers.forEach((marker, i) => {
            if (i === Math.floor(index / 2)) {
                marker.style.backgroundColor = 'black';
                marker.style.width = '30px';
                marker.style.borderRadius = '10px';
            } else {
                marker.style.backgroundColor = '#ccc';
                marker.style.width = '12px';
                marker.style.borderRadius = '50%';
            }
        });
    });

    markers.forEach((marker, i) => {
        marker.addEventListener('click', () => {
            const scrollAmount = i * (carousel.offsetWidth / 1.5);
            carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        marker.style.cursor = 'pointer';
    });
</script>