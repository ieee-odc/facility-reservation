import React, { useState, useRef } from 'react';
import './ResizableSplitter.css';

const ResizableSplitter = ({ leftComponent, rightComponent }) => {
    const [dragging, setDragging] = useState(false);
    const [dividerPosition, setDividerPosition] = useState(50); // Start with 50% width for both sides
    const containerRef = useRef(null);

    const handleMouseDown = () => {
        setDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        const containerWidth = containerRef.current.offsetWidth;
        const newDividerPosition = (e.clientX / containerWidth) * 100;
        setDividerPosition(newDividerPosition);
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    return (
        <div 
            className="splitter-container" 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // In case the user releases the mouse outside the container
        >
            <div 
                className="splitter-panel left-panel" 
                style={{ width: `${dividerPosition}%` }}
            >
                {leftComponent}
            </div>
            <div 
                className="splitter-divider" 
                onMouseDown={handleMouseDown}
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
