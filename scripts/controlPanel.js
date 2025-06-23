// Control Panel Functionality

document.addEventListener('DOMContentLoaded', function () {
    // Toggle buttons
    document.querySelectorAll('.toggle-item').forEach(item => {
        item.addEventListener('click', function () {
            // Toggle active state (single select for demo)
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            } else {
                // If you want only one active per row, uncomment below:
                // item.parentElement.querySelectorAll('.toggle-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Theme toggle
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            // Example: toggle body class for theme
            if (option.querySelector('.theme-label').textContent.includes('Dark')) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        });
    });

    // Sliders (simple drag logic)
    document.querySelectorAll('.slider').forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const fill = slider.querySelector('.slider-fill');
        const thumb = slider.querySelector('.slider-thumb');

        function setSlider(percent) {
            fill.style.width = percent + '%';
            thumb.style.left = percent + '%';
        }

        let dragging = false;
        thumb.addEventListener('mousedown', function (e) {
            dragging = true;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            const rect = track.getBoundingClientRect();
            let percent = ((e.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            setSlider(percent);
        });
        document.addEventListener('mouseup', function () {
            dragging = false;
            document.body.style.userSelect = '';
        });
        // Click on track to move thumb
        track.addEventListener('click', function (e) {
            const rect = track.getBoundingClientRect();
            let percent = ((e.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            setSlider(percent);
        });
    });
}); 