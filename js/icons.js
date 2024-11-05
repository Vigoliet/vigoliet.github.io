document.querySelectorAll('.skills-list li').forEach(function(item) {
    const iconClass = item.getAttribute('data-icon');
    if (iconClass) {
        const iconElement = document.createElement('i');
        iconElement.className = iconClass;
        item.insertBefore(iconElement, item.firstChild);
    }
});
