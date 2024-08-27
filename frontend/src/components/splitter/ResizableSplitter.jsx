import React, { useState, useRef, useEffect } from 'react';
import './ResizableSplitter.css';

const ResizableSplitter = ({ leftComponent, rightComponent }) => {
    const [dragging, setDragging] = useState(false);
    const [dividerPosition, setDividerPosition] = useState(22);
    const containerRef = useRef(null);

    const handleDragStart = () => {
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    const handleDrag = (clientX) => {
        if (!dragging) return;
        const containerWidth = containerRef.current.offsetWidth;
        let newDividerPosition = (clientX / containerWidth) * 100;

        newDividerPosition = Math.max(0, Math.min(newDividerPosition, 80));

        setDividerPosition(newDividerPosition);
    };

    // Mouse event handlers
    const onMouseDown = (e) => {
        e.preventDefault();
        handleDragStart();
    };

    const onMouseMove = (e) => {
        handleDrag(e.clientX);
    };

    const onMouseUp = () => {
        handleDragEnd();
    };

    // Touch event handlers
    const onTouchStart = (e) => {
        handleDragStart();
    };

    const onTouchMove = (e) => {
        if (e.touches.length !== 1) return; // Only handle single touch
        handleDrag(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
        handleDragEnd();
    };

    // Effect to add/remove global event listeners based on dragging state
    useEffect(() => {
        if (dragging) {
            // Add event listeners to handle dragging outside the splitter
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onTouchEnd);
        } else {
            // Remove event listeners when not dragging
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        }

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [dragging]);

    return (
        <div className="splitter-container" ref={containerRef}>
            <div
                className="splitter-panel left-panel"
                style={{ width: `${dividerPosition}%` }}
            >
                {leftComponent}
            </div>
            <div
                className="splitter-divider"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            />
            <div
                className="splitter-panel right-panel"
                style={{ width: `${100 - dividerPosition}%` }}
            >
                {rightComponent}
            </div>
        </div>
    );
};

export default ResizableSplitter;
