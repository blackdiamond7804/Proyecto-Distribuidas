function Sidebar({ users }) {
  return (
    <div className="w-full md:w-[260px] bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 p-5 flex flex-col shadow-xl">

      <div className="mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Online Users ({users.length})
        </h2>
      </div>

      <div className="space-y-2 overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No hay usuarios conectados</p>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-750 hover:to-slate-650 p-3 rounded-xl border border-slate-600/50 transition duration-200 hover:shadow-lg hover:border-cyan-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium text-slate-100 truncate text-sm">
                  {user.nickname}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;