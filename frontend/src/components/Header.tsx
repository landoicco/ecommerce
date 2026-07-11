interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
}

export default function Header({ searchQuery, onSearchChange, onOpenCreate }: HeaderProps) {
  return (
    <header className="border-b border-gray-100 pb-6 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Inventory Terminal</h1>
        <p className="text-xs text-gray-400 mt-0.5">Technical catalog management</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <input
          type="text"
          placeholder="Filter by name, SKU or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-64 text-xs bg-white border border-gray-100 rounded-md px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
        />
        <button
          onClick={onOpenCreate}
          className="w-full sm:w-auto text-xs font-medium px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          Add Item
        </button>
      </div>
    </header>
  );
}
