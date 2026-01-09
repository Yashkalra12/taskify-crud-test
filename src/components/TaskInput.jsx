import { useState } from 'react';

export default function TaskInput({ onAdd }) {
    const [task, setTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.trim()) return;
        onAdd(task);
        setTask('');
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 w-full max-w-2xl mx-auto flex gap-4 items-center animate-fade-in-up">
            <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-primary to-neon-secondary rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="ENTER NEW MISSION OBJECTIVE..."
                    className="relative w-full bg-dark-bg text-white border-2 border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-neon-primary placeholder-gray-500 font-rajdhani tracking-wider text-lg"
                />
            </div>
            <button
                type="submit"
                className="btn-neon whitespace-nowrap"
            >
                INITIATE
            </button>
        </form>
    );
}
