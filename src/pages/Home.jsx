export default function Home() {
  return (
    <div className="p-4 pb-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">Olá,</p>
          <h1 className="text-white text-2xl font-bold">Atleta 💪</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-black font-bold">
          A
        </div>
      </div>

      {/* Card de calorias */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Hoje</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-400 text-5xl font-bold">0</p>
            <p className="text-gray-400 text-sm mt-1">kcal consumidas</p>
          </div>
          <div className="text-right">
            <p className="text-white text-lg font-bold">2000</p>
            <p className="text-gray-400 text-xs">meta</p>
            <p className="text-orange-400 text-lg font-bold mt-2">2000</p>
            <p className="text-gray-400 text-xs">restante</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-800 rounded-full h-2">
          <div className="bg-green-400 h-2 rounded-full w-0 transition-all"></div>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Proteína', value: '0g', color: 'text-green-400' },
          { label: 'Carbs', value: '0g', color: 'text-orange-400' },
          { label: 'Gordura', value: '0g', color: 'text-blue-400' },
        ].map(macro => (
          <div key={macro.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${macro.color}`}>{macro.value}</p>
            <p className="text-gray-400 text-xs mt-1">{macro.label}</p>
          </div>
        ))}
      </div>

      {/* Últimas refeições */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-bold">Últimas refeições</h2>
        <span className="text-green-400 text-sm cursor-pointer">Ver tudo →</span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
        <p className="text-gray-500 text-sm text-center py-4">
          Nenhuma refeição registrada hoje
        </p>
      </div>

      {/* Botão adicionar refeição */}
      <label className="flex items-center justify-center gap-3 w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 rounded-2xl cursor-pointer transition-all active:scale-95">
        <span className="text-2xl">📸</span>
        <span className="text-base">Adicionar refeição</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => console.log(e.target.files[0])}
        />
      </label>

    </div>
  )
}