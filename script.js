document.addEventListener('DOMContentLoaded', () => {
    // 1. Dialog Interactivity
    const dialog = document.querySelector('dialog');
    const closeBtn = dialog.querySelector('button');
    
    // Add an open button dynamically next to the dialog
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Dialog Modal';
    openBtn.style.marginBottom = '1rem';
    dialog.parentNode.insertBefore(openBtn, dialog);

    openBtn.addEventListener('click', () => {
        dialog.showModal();
    });

    closeBtn.addEventListener('click', () => {
        dialog.close();
    });

    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close();
        }
    });

    // 2. Canvas Drawing
    const canvas = document.getElementById('myCanvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        
        // Draw a modern graphic
        ctx.fillStyle = '#3b82f6'; // Blue
        ctx.fillRect(10, 10, 50, 50);

        ctx.fillStyle = '#ef4444'; // Red
        ctx.beginPath();
        ctx.arc(120, 50, 30, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.strokeStyle = '#10b981'; // Green
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, 80, 40);
        
        ctx.font = '14px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Canvas Render', 50, 90);
    }

    // 3. Input Feedback (Range slider)
    const rangeInput = document.getElementById('range');
    if (rangeInput) {
        const output = document.createElement('span');
        output.textContent = ` Value: ${rangeInput.value}`;
        output.style.fontWeight = 'bold';
        rangeInput.parentNode.insertBefore(output, rangeInput.nextSibling);

        rangeInput.addEventListener('input', (e) => {
            output.textContent = ` Value: ${e.target.value}`;
        });
    }
});
