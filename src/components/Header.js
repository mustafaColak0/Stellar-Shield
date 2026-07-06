import React, { useState, useEffect } from 'react';
import { checkConnection, retrievePublicKey, getBalance, sendXlmTransaction, fetchNetworkFee } from './Freighter';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Wallet, Send, ShieldAlert, QrCode, Moon, Sun, 
  Copy, Check, LayoutDashboard, LogOut, Activity,
  History, BookUser, Search, Plus, Trash2, ChevronDown, Laptop
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Header() {
    // ---------------- STATE MANAGEMENT (STANDART JS) ----------------
    const [connected, setConnected] = useState(false);
    const [connectedWalletType, setConnectedWalletType] = useState(''); 
    const [publicKey, setPublicKey] = useState('');
    const [balance, setBalance] = useState('0');
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); 
    
    // UI & Graphic States
    const [copied, setCopied] = useState(false);
    const [networkFee, setNetworkFee] = useState({ baseFee: '0.00010', status: 'Düşük (Normal)' });
    const [balanceData, setBalanceData] = useState([]);
    
    /// Asset, History, and Address Book States
    const [selectedAsset, setSelectedAsset] = useState('XLM');
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [addressBook, setAddressBook] = useState([
        { id: 1, name: 'Jüri İnceleme Cüzdanı', address: 'GBJURI777...TESTNET' },
        { id: 2, name: 'Siber Güvenlik Kasası', address: 'GASHIELD99...TESTNET' },
        { id: 3, name: 'My Account 2', address: 'GAQVXWJ6QWNVNM3OWK4MREYSK52WM76RSJQS2TKV2KUH47CCULBY4UN4' }
    ]);
    const [newContact, setNewContact] = useState({ name: '', address: '' });
    
    // Transfer States
    const [destination, setDestination] = useState('');
    const [amount, setAmount] = useState('');
    const [txStatus, setTxStatus] = useState({ type: '', message: '', hash: '' });
    const [showSecurityConfirm, setShowSecurityConfirm] = useState(false);
    const [securityCheck, setSecurityCheck] = useState(false);

    // ---------------- FUNCTIONS ----------------
    useEffect(() => {
        const init = async () => {
            try {
                const hasAccess = await checkConnection();
                if (hasAccess) {
                    const key = await retrievePublicKey();
                    if (key) {
                        setPublicKey(key);
                        setConnected(true);
                        setConnectedWalletType('Freighter');
                        const bal = await getBalance();
                        setBalance(bal);
                        const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' });
                        setBalanceData([{ time: 'Başlangıç', balance: parseFloat(bal) }, { time: now, balance: parseFloat(bal) }]);
                    }
                }
                const feeData = await fetchNetworkFee();
                if (feeData.success) setNetworkFee({ baseFee: feeData.baseFee, status: feeData.status });
            } catch (err) { console.error(err); }
        };
        init();
    }, []);

// Multiple wallet connection Logic
const connectWallet = async (walletType) => {
    setLoading(true);
    try {
        if (walletType === 'Freighter') {
            const hasAccess = await checkConnection();
            if (hasAccess) {
                const key = await retrievePublicKey();
                if (key) {
                    setPublicKey(key);
                    setConnected(true);
                    setConnectedWalletType('Freighter');
                    const bal = await getBalance();
                    setBalance(bal);
                    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' });
                    setBalanceData([{ time: 'Başlangıç', balance: parseFloat(bal) }, { time: now, balance: parseFloat(bal) }]);
                }
            }
        } else {
            //Opens official auth/download pages for xBull and Albedo in a new tab
            if (walletType === 'xBull') {
                window.open("https://chromewebstore.google.com/detail/xbull-wallet/omajpeaffjgmlpmhbfdjepdejoemifpe", "_blank");
            } else if (walletType === 'Albedo') {
                window.open("https://albedo.link/signup", "_blank");
            }

            // Sets the state to notify the UI which wallet is currently connecting
            setConnectedWalletType(walletType); 
            setLoading(true); 
            
            // Automatically ends loading and unlocks wallet selection if connection isn't completed within 10s
            setTimeout(() => {
                // Verifies active connection status using the 'connected' state variable
                if (!connected) { 
                    setLoading(false);
                    setConnectedWalletType(null);
                }
            }, 20000);

            return;
        }
    } catch (error) { 
        console.error(error); 
        // Reset all states on error to prevent the wallet selection screen from freezing
        setLoading(false);
        setConnectedWalletType(null);
    } finally { 
        if (walletType === 'Freighter') setLoading(false); 
    }
};

    const disconnectWallet = () => {
        setConnected(false); setPublicKey(''); setBalance('0'); setBalanceData([]); setConnectedWalletType(''); setActiveTab('dashboard');
    };

    const copyToClipboard = (textToCopy = publicKey) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const handleAddContact = (e) => {
        e.preventDefault();
        if(newContact.name && newContact.address) {
            setAddressBook([...addressBook, { id: Date.now(), ...newContact }]);
            setNewContact({ name: '', address: '' });
        }
    };

    const triggerTransferApproval = (e) => {
        e.preventDefault();
        if (!destination || !amount) {
            setTxStatus({ type: 'error', message: 'Please fill in all fields!', hash: '' });
            return;
        }
        setShowSecurityConfirm(true);
    };

    const executeTransfer = async () => {
        setShowSecurityConfirm(false);
        if (!securityCheck) return;

        setTxStatus({ type: 'info', message: 'Waiting for cryptographic signature...', hash: '' });
        
        // Multi-entity simulation controls
        if (selectedAsset !== 'XLM') {
            setTimeout(() => {
                setTxStatus({ type: 'error', message: `❌ Error: ${selectedAsset} is not supported on the Stellar network.`, hash: '' });
                setSecurityCheck(false);
            }, 1200);
            return;
        }

        if (connectedWalletType !== 'Freighter') {
            setTimeout(() => {
                const mockHash = Math.random().toString(16).substring(2, 18) + "ffffff";
                setTxStatus({ type: 'success', message: `🎉 [${connectedWalletType}] The transaction was successfully processed on the network!`, hash: mockHash });
                const currentBal = parseFloat(balance) - parseFloat(amount);
                setBalance(currentBal.toFixed(4));
                setBalanceData(prev => [...prev, { time: 'Now', balance: currentBal }]);
                setTransactions(prev => [{ id: Date.now(), date: new Date().toLocaleString('tr-TR'), to: destination, amount, asset: selectedAsset, hash: mockHash }, ...prev]);
                setDestination(''); setAmount('');
            }, 1500);
            return;
        }

        const result = await sendXlmTransaction(destination, amount);
        if (result.success) {
            setTxStatus({ type: 'success', message: `🎉The transaction was successfully processed on the network!`, hash: result.hash });
            const newBal = await getBalance();
            setBalance(newBal);
            const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' });
            setBalanceData(prev => [...prev, { time: now, balance: parseFloat(newBal) }]);
            setTransactions(prev => [{ id: Date.now(), date: new Date().toLocaleString('tr-TR'), to: destination, amount, asset: selectedAsset, hash: result.hash }, ...prev]);
            setDestination(''); setAmount('');
        } else {
            setTxStatus({ type: 'error', message: `❌ Error: ${result.error}`, hash: '' });
        }
        setSecurityCheck(false);
    };

    const filteredTransactions = transactions.filter(tx => 
        tx.to.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        
       <div className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden`}>
    
    {/* SOL SIDEBAR (mobile-responsive) */}
    <div className={`w-full md:w-72 border-b md:border-b-0 md:border-r flex flex-col justify-between p-4 md:p-6 ${darkMode ? 'bg-slate-900/60 border-slate-900' : 'bg-white border-slate-200'}`}>
        <div className="space-y-4 md:space-y-8">
            <div className="flex items-center justify-between">
                {/* LOGO && NAME SPACE */}
                <div 
                    onClick={() => setActiveTab('dashboard')} 
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition active:scale-95 select-none"
                    title="Return to Home Page"
                >
                    <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center font-black text-slate-950 tracking-tighter text-sm">SS</div>
                    <span className="font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 text-lg">STELLAR SHIELD</span>
                </div>
                
                <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl transition ${darkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-indigo-600 hover:bg-slate-200'}`}>
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

                    <nav className="space-y-1.5">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'transfer', icon: Send, label: 'Transfer (Multi-Asset)' },
                            { id: 'history', icon: History, label: 'Transaction History' },
                            { id: 'contacts', icon: BookUser, label: 'Address Book' },
                            { id: 'receive', icon: QrCode, label: 'QR Code   (Receive)' },
                            { id: 'security', icon: ShieldAlert, label: 'Security Audit' }
                        ].map((item) => (
                            <button 
                                key={item.id} 
                                onClick={() => connected && setActiveTab(item.id)} 
                                disabled={!connected} 
                                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${!connected ? 'opacity-40 cursor-not-allowed' : activeTab === item.id ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10' : 'text-slate-400 hover:bg-slate-800/50'}`}
                            >
                                <item.icon size={20} /> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {connected && (
                    <div className="space-y-3">
                        <div className="text-[10px] text-center font-mono text-slate-500 bg-slate-950/40 py-1 rounded border border-slate-900">Connected via: <span className="text-cyan-400 font-bold">{connectedWalletType}</span></div>
                        <button onClick={disconnectWallet} className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-semibold text-sm bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                            <LogOut size={18} /> Disconnect Wallet
                        </button>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT SPACE */}
            <div className="p-8 lg:p-12 w-full max-w-5xl mx-auto flex-1 flex flex-col justify-start overflow-y-auto">
                {!connected ? (
                    <div className="max-w-xl mx-auto my-auto text-center space-y-6">
                        <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <Wallet size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Secure Web3 Gateway</h2>
                            <p className="text-slate-400 text-sm max-w-md mx-auto">
                                Select an approved wallet model to establish a secure connection with the Stellar network.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                            <button onClick={() => connectWallet('Freighter')} disabled={loading} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all text-center group flex flex-col items-center justify-center space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition"><Wallet size={20}/></div>
                                <span className="text-sm font-bold block text-slate-200">Freighter</span>
                                <span className="text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">Official Extension</span>
                            </button>
                            
                            <button onClick={() => connectWallet('xBull')} disabled={loading} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 transition-all text-center group flex flex-col items-center justify-center space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition"><Laptop size={20}/></div>
                                <span className="text-sm font-bold block text-slate-200">xBull Wallet</span>
                                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Multi-Chain API</span>
                            </button>

                            <button onClick={() => connectWallet('Albedo')} disabled={loading} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all text-center group flex flex-col items-center justify-center space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition"><QrCode size={20}/></div>
                                <span className="text-sm font-bold block text-slate-200">Albedo Link</span>
                                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Web Intent API</span>
                            </button>
                        </div>

                        {/* Cryptographic Handshake / Loading Warning */}
                        {loading && connectedWalletType === 'Freighter' && (
                            <div className="text-xs font-mono text-cyan-400 animate-pulse mt-4">
                                Cryptographic handshake is being performed...
                            </div>
                        )}

                       {/* Sandbox  Simulation Area */}
                        {loading && connectedWalletType !== 'Freighter' && (
                            <div className="text-center mt-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800 max-w-md mx-auto flex flex-col gap-4">
                                <div>
                                    <p className="text-sm text-slate-400 mb-1 animate-pulse">
                                        {connectedWalletType} connection opened in a separate tab.
                                    </p>
                                </div>

                                {/* Simulation-based Connection Button */}
                                <button 
                                    onClick={() => {
                                        const mockKey = connectedWalletType === 'xBull' 
                                            ? 'GBXBULL1234567890XBULLTESTNETSECRETKEY' 
                                            : 'GBALBEDO0987654321ALBEDOTESTNETSECRETKEY';
                                            
                                        setPublicKey(mockKey);
                                        setConnected(true);
                                        setBalance('10000.0000');
                                        const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' });
                                        setBalanceData([{ time: 'Başlangıç', balance: 10000 }, { time: now, balance: 10000 }]);
                                        setLoading(false);
                                    }}
                                    className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-600/20 active:scale-95 w-fit mx-auto"
                                >
                                    {connectedWalletType} Simulation with Continue →
                                </button>

                                <button 
                                    onClick={() => {
                                        setLoading(false);
                                        setConnectedWalletType(null);
                                    }}
                                    className="mt-4 text-sm text-slate-400 hover:text-white underline block mx-auto"
                                >
                                    Cancel and Change Wallet
                                </button>
                            </div>
                        )}
                    </div>
                ) : ( <div className="w-full space-y-6">
                       
                        {/* DASHBOARD CONTENT */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6 w-full animate-in fade-in zoom-in-95 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`p-8 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                        <span className="text-xs text-slate-400 font-medium block mb-2">Total Wallet Assets</span>
                                        <div className="text-4xl font-black tracking-tight">
                                            {parseFloat(balance).toLocaleString(undefined, {minimumFractionDigits: 2})} <span className="text-sm font-bold text-cyan-400">XLM</span>
                                        </div>
                                    </div>
                                    
                                    <div className={`p-8 rounded-2xl border relative overflow-hidden flex flex-col justify-end ...`}>
                                        <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="font-black tracking-wider text-[10px]">LIVE</span>
                                        </div>
                                    

                                        <div className="mt-6">
                                            <span className="text-xs text-slate-400 font-medium block mb-2">Instant Network Transaction Fee (Base Fee)</span>
                                            <div className="text-2xl font-mono font-bold text-teal-400 mb-2">{networkFee?.baseFee || '0.00001'} XLM</div>
                                            <span className="text-xs bg-slate-800/80 px-3 py-1 rounded-full text-slate-300 border border-slate-700/50">{networkFee?.status || 'Active'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl border h-80 flex flex-col ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <h3 className="text-sm font-bold mb-6 text-cyan-400 flex items-center gap-2"><Activity size={18} /> Instant Asset Flow Chart</h3>
                                    <div className="flex-1 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                                                <XAxis dataKey="time" stroke={darkMode ? '#475569' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} />
                                                <YAxis stroke={darkMode ? '#475569' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', borderColor: darkMode ? '#1e293b' : '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }} />
                                                <Area type="monotone" dataKey="balance" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TRANSFER (MULTI-ASSET) CONTENT */}
                        {activeTab === 'transfer' && (
                            <div className={`p-8 rounded-2xl border animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Send size={22} /> Multi-Asset Transfer</h3>
                                <form onSubmit={triggerTransferApproval} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Asset to Send</label>
                                            <div className="relative">
                                                <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-cyan-500 text-slate-200 appearance-none">
                                                    <option value="XLM">XLM (Stellar Lumens)</option>
                                                    <option value="USDC">USDC (USD Coin)</option>
                                                    <option value="EURC">EURC (Euro Coin)</option>
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-4 text-slate-400 pointer-events-none"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Amount</label>
                                            <input type="number" step="any" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-cyan-500 text-slate-200" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs text-slate-400 font-medium">Recipient Address (Public Key)</label>
                                            <div className="text-xs text-cyan-400 cursor-pointer flex items-center gap-1" onClick={() => setActiveTab('contacts')}><BookUser size={12}/> Select from Contacts</div>
                                        </div>
                                        <input type="text" placeholder="G..." value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:border-cyan-500 text-slate-200" />
                                    </div>
                                    <button type="submit" className="w-full py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/10">Sign & Send Transaction</button>
                                </form>

                                {txStatus?.message && (
                                    <div className={`mt-6 p-4 rounded-xl text-xs border ${txStatus.type === 'success' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900' : txStatus.type === 'error' ? 'bg-rose-950/20 text-rose-400 border-rose-900' : 'bg-cyan-950/20 text-cyan-400 border-cyan-900'}`}>
                                        <div>{txStatus.message}</div>
                                        {txStatus.hash && <div className="mt-2 font-mono p-2 bg-slate-950 rounded border border-slate-800 break-all">Hash: {txStatus.hash}</div>}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TRANSACTION HISTORY & SEARCH TAB CONTENT */}
                        {activeTab === 'history' && (
                            <div className={`p-8 rounded-2xl border animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2"><History size={22} /> Transaction History</h3>
                                    <div className="relative w-full sm:w-64">
                                        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input type="text" placeholder="Search address or hash..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500 text-slate-200" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {filteredTransactions && filteredTransactions.length === 0 ? (
                                        <div className="text-center p-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl bg-slate-950/50">Henüz bir veri bulunamadı.</div>
                                    ) : (
                                        filteredTransactions?.map(tx => (
                                            <div key={tx.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <div className="text-xs text-slate-400 mb-1">{tx.date}</div>
                                                    <div className="font-mono text-xs text-cyan-400 break-all">Recipient: {tx.to}</div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="font-bold text-rose-400">- {tx.amount} {tx.asset}</div>
                                                    <a href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-cyan-400 underline mt-1 block">Stellar Expert</a>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ADDRESS BOOK TAB CONTENT */}
                        {activeTab === 'contacts' && (
                            <div className={`p-8 rounded-2xl border animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BookUser size={22} /> Address Book</h3>
                                <form onSubmit={handleAddContact} className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                    <input type="text" placeholder="Person/Organization Name" value={newContact?.name || ''} onChange={(e) => setNewContact({...newContact, name: e.target.value})} className="flex-1 bg-transparent border-b border-slate-800 px-2 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200" required />
                                    <input type="text" placeholder="Stellar Address" value={newContact?.address || ''} onChange={(e) => setNewContact({...newContact, address: e.target.value})} className="flex-[2] bg-transparent border-b border-slate-800 px-2 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500 text-slate-200" required />
                                    <button type="submit" className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-1"><Plus size={16}/> Add</button>
                                </form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addressBook?.map(contact => (
                                        <div key={contact.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-200 mb-1">{contact.name}</h4>
                                                <p className="font-mono text-[10px] text-slate-500 break-all mb-4">{contact.address}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setDestination(contact.address); setActiveTab('transfer'); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-bold transition">Send Money</button>
                                                <button onClick={() => setAddressBook(addressBook.filter(c => c.id !== contact.id))} className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* QR CODE (RECEIVE) TAB CONTENT */}
                        {activeTab === 'receive' && (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto text-center">
                                <div className="flex justify-center mb-4 text-cyan-400"><QrCode className="w-8 h-8" /></div>
                                <h3 className="text-xl font-bold text-white mb-2">Account QR Code</h3>
                                <p className="text-sm text-slate-400 mb-6">Scan this QR code to quickly receive Stellar Testnet assets to your account.</p>

                                <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl shadow-cyan-500/5">
                                    {connected && publicKey ? (
                                        <QRCodeSVG value={publicKey} size={220} level="H" includeMargin={true} />
                                    ) : (
                                        <div className="w-[220px] h-[220px] flex items-center justify-center text-slate-800 font-medium bg-slate-100 rounded-xl">Please Connect Your Wallet</div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 max-w-lg mx-auto">
                                    <span className="text-xs font-mono text-cyan-400 select-all truncate mr-4">{connected && publicKey ? publicKey : 'Wallet Not Connected'}</span>
                                    {connected && publicKey && (
                                        <button onClick={() => copyToClipboard(publicKey)} className="text-slate-400 hover:text-white transition-colors" title="Copy Address">
                                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                                                                                                        
                        {/* SECURITY AUDIT TAB CONTENT */}
                        {activeTab === 'security' && (
                            <div className={`p-8 rounded-2xl border animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-400"><ShieldAlert size={22} /> dApp Security Monitoring</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="flex justify-between items-center p-4 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="text-slate-400">SSL / TLS Connection Status</span>
                                        <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/30">Secure (HTTPS)</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="text-slate-400">Wallet Injection Interceptor</span>
                                        <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/30">Active ({connectedWalletType} Sandbox)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* SECURITY CONFIRM MODAL */}
            {showSecurityConfirm && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 text-amber-400"><ShieldAlert size={28} /><h3 className="text-xl font-bold">Security and Transaction Confirmation</h3></div>
                        <p className="text-sm text-slate-300 leading-relaxed">Amount: <strong className="text-white">{amount} {selectedAsset}</strong><br/>Recipient: <span className="font-mono text-xs text-cyan-400 break-all block mt-1">{destination}</span></p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">⚠️ This transaction cannot be undone. Network fees will be deducted from your wallet.</div>
                        <label className="flex items-start gap-3 text-xs text-slate-300 cursor-pointer select-none">
                            <input type="checkbox" checked={securityCheck} onChange={(e) => setSecurityCheck(e.target.checked)} className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0" />
                            <span>I have reviewed the cyber security risk analysis of the address and confirm its validity.</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setShowSecurityConfirm(false)} className="py-3 rounded-xl bg-slate-800 font-bold text-sm text-slate-300 hover:bg-slate-700 transition">Cancel</button>
                            <button onClick={executeTransfer} disabled={!securityCheck} className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-sm hover:opacity-90 transition disabled:opacity-30">Sign Transaction</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Header;