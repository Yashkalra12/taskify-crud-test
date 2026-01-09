export default function TaskList({ tasks, onToggle }) {
    if (tasks.length === 0) {
        return (
            <div className="text-center text-gray-500 font-rajdhani text-xl mt-12 animate-pulse">
                NO MISSIONS ACTIVE. SYSTEMS IDLE.
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={`glass-card p-4 flex items-center justify-between group transition-all duration-300 ${task.completed ? 'opacity-50 hover:opacity-70' : 'hover:scale-[1.02]'}`}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onToggle(task.id)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${task.completed
                                    ? 'bg-neon-primary border-neon-primary shadow-neon-blue'
                                    : 'bg-transparent border-gray-500 hover:border-neon-primary'
                                }`}
                        >
                            {task.completed && (
                                <svg className="w-4 h-4 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                        <span className={`font-rajdhani text-xl ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.text}
                        </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${task.completed
                            ? 'border-green-500 text-green-500'
                            : 'border-neon-secondary text-neon-secondary shadow-neon-purple'
                        }`}>
                        {task.completed ? 'COMPLETED' : 'PENDING'}
                    </span>
                </div>
            ))}
        </div>
    );
}
