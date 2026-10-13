import React, { useState, useMemo } from 'react';
import {
  Heart,
  Activity,
  ClipboardList,
  BookOpen,
  Calculator,
  FileText,
  User,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  LogOut,
  Plus,
  Copy,
  RefreshCw,
  Menu,
  X,
  Sparkles,
  Stethoscope,
  Clock,
  Check,
  Droplets,
  Thermometer,
  Pill,
  UserPlus,
  Trash2,
  Bed,
  Users,
  Smile,
  Coffee,
  HeartPulse,
  Send,
  Download,
  Info
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [user, setUser] = useState({
    name: "Claire Antonette Buquel",
    email: "claire.buquel@mymail.mapua.edu.ph",
    role: "Student Nurse",
    studentId: "2023-149021-MN",
    institution: "Mapúa University - School of Health Sciences"
  });

  // Navigation: 'ehr', 'ai_education', 'careplan', 'calculator', 'isbar'
  const [activeTab, setActiveTab] = useState('ehr');
  
  // Dynamic Patients Roster (Starts completely empty - no defaults!)
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  
  // UI & Drawer States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // New Patient Admit Form State
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Female',
    room: '',
    diagnosis: '',
    allergy: 'No Known Drug Allergies (NKDA)',
    diet: 'Regular Diet',
    codeStatus: 'Full Code',
    attendingPhysician: 'Dr. C. Mendoza, MD'
  });

  // Resolve currently active patient
  const currentPatient = useMemo(() => {
    if (!patients.length) return null;
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleLogout = () => {
    setUser(null);
    showToast("Signed out of AADA Clinical Suite. See you on duty! 💕");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    showToast(`Welcome, ${userData.name}! ✨ Mapúa Session Active`);
  };

  const handleCreatePatient = (e) => {
    e.preventDefault();
    if (!newPatientForm.name || !newPatientForm.room || !newPatientForm.diagnosis) {
      showToast("Please provide Patient Name, Bed/Room, and Diagnosis! 🎀");
      return;
    }

    const uniqueId = `AADA-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Newly created patient starts with NO default orders and NO default I&O entries
    const newBedPatient = {
      id: uniqueId,
      name: newPatientForm.name,
      age: parseInt(newPatientForm.age) || 20,
      gender: newPatientForm.gender,
      room: newPatientForm.room,
      diagnosis: newPatientForm.diagnosis,
      allergy: newPatientForm.allergy || 'NKDA',
      diet: newPatientForm.diet || 'Regular Diet',
      codeStatus: newPatientForm.codeStatus || 'Full Code',
      attendingPhysician: newPatientForm.attendingPhysician || 'Attending MD',
      vitals: [
        {
          id: Date.now(),
          time: currentTime,
          bp: "120/80",
          hr: 78,
          rr: 18,
          temp: "36.8°C",
          spo2: "99%",
          pain: "0/10",
          recordedBy: `${user ? user.name : 'SN Buquel'} (Mapúa)`
        }
      ],
      // Completely empty, addable list of I&O records
      ioLogs: [],
      // Completely empty, addable list of Doctor's Orders
      orders: [],
      fdarNotes: [
        {
          id: Date.now(),
          focus: "Initial Bed Admission",
          date: currentTime,
          author: `${user ? user.name : 'Student Nurse'}, Mapúa SN`,
          data: `Received patient resting comfortably in ${newPatientForm.room}. Admitted with diagnosis of ${newPatientForm.diagnosis}. Baseline vitals recorded.`,
          action: "Oriented patient and bedside family to unit protocols and call bell controls. Maintained safety precautions.",
          response: "Patient acknowledged in understanding and verbalized cooperation with nursing care."
        }
      ]
    };

    setPatients([newBedPatient, ...patients]);
    setSelectedPatientId(newBedPatient.id);
    setShowAddPatientModal(false);
    
    // Reset form
    setNewPatientForm({
      name: '',
      age: '',
      gender: 'Female',
      room: '',
      diagnosis: '',
      allergy: 'No Known Drug Allergies (NKDA)',
      diet: 'Regular Diet',
      codeStatus: 'Full Code',
      attendingPhysician: 'Dr. C. Mendoza, MD'
    });

    showToast(`🌸 ${newBedPatient.name} admitted to ${newBedPatient.room}!`);
  };

  const handleDischargePatient = (patientId, patientName) => {
    const updated = patients.filter(p => p.id !== patientId);
    setPatients(updated);
    if (selectedPatientId === patientId) {
      setSelectedPatientId(updated.length > 0 ? updated[0].id : null);
    }
    showToast(`🎀 ${patientName} discharged and archived safely.`);
  };

  // Render Login Screen if user is logged out
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#fff0f5] text-slate-800 flex flex-col md:flex-row font-sans selection:bg-pink-200">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-4 py-3 rounded-2xl shadow-xl shadow-pink-200/80 flex items-center gap-2.5 border border-pink-300 animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-200 shrink-0" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* ===================== DESKTOP CUTE SIDEBAR ===================== */}
      <aside className="hidden md:flex flex-col w-72 bg-white/95 backdrop-blur-md border-r border-pink-200 p-5 shrink-0 shadow-sm shadow-pink-100">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-pink-500 flex items-center justify-center shadow-md shadow-pink-300/50">
            <Heart className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>Ai Ai Delas Alas</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            </div>
            <div className="text-[10px] font-mono tracking-wider font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-pink-200">
              AADA CLINICAL SUITE
            </div>
            <div className="text-[11px] text-rose-500 font-bold flex items-center gap-1 mt-0.5">
              <span>Mapúa University Students</span>
            </div>
          </div>
        </div>

        {/* Patient Bed Management Box */}
        <div className="mt-5 bg-gradient-to-br from-pink-50 via-rose-50/50 to-pink-50 border border-pink-200 rounded-3xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-extrabold text-pink-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-pink-500" />
              <span>Duty Bed Roster ({patients.length})</span>
            </label>
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="text-[11px] font-extrabold text-pink-600 hover:text-white bg-white hover:bg-pink-500 border border-pink-300 px-2.5 py-1 rounded-full flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Admit</span>
            </button>
          </div>

          {patients.length > 0 ? (
            <select
              value={selectedPatientId || ''}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                const found = patients.find(p => p.id === e.target.value);
                if (found) showToast(`Switched active bed to ${found.name} 💕`);
              }}
              className="w-full bg-white border border-pink-300 text-xs font-bold text-slate-800 rounded-2xl p-2.5 focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-2xs cursor-pointer"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  🛏️ {p.room.split(' - ')[0]} • {p.name} ({p.age}y)
                </option>
              ))}
            </select>
          ) : (
            <div className="text-center py-2.5 px-1 bg-white/70 rounded-2xl border border-dashed border-pink-300">
              <p className="text-[11px] text-pink-500 font-bold">No active patients admitted yet</p>
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="mt-1 text-[10px] text-pink-600 font-extrabold underline hover:text-pink-700"
              >
                + Admit your first patient
              </button>
            </div>
          )}
        </div>

        {/* Cute Rounded Navigation Pills */}
        <nav className="mt-5 flex-1 space-y-2">
          <CutePillNavButton
            active={activeTab === 'ehr'}
            onClick={() => setActiveTab('ehr')}
            icon={<HeartPulse className="w-4 h-4" />}
            title="SimChart EHR & Vitals"
            subtitle="Flowsheets, I&O & FDAR Notes"
          />
          <CutePillNavButton
            active={activeTab === 'ai_education'}
            onClick={() => setActiveTab('ai_education')}
            icon={<Sparkles className="w-4 h-4" />}
            title="AADA Health Teacher"
            subtitle="Plain Language Discharge & Teach-Back"
          />
          <CutePillNavButton
            active={activeTab === 'careplan'}
            onClick={() => setActiveTab('careplan')}
            icon={<BookOpen className="w-4 h-4" />}
            title="ADPIE Care Planner"
            subtitle="NANDA Goals & Scientific Rationales"
          />
          <CutePillNavButton
            active={activeTab === 'calculator'}
            onClick={() => setActiveTab('calculator')}
            icon={<Calculator className="w-4 h-4" />}
            title="IV Drip & Drug Dosages"
            subtitle="gtts/min, Flow Rates & D/H × Q"
          />
          <CutePillNavButton
            active={activeTab === 'isbar'}
            onClick={() => setActiveTab('isbar')}
            icon={<ClipboardList className="w-4 h-4" />}
            title="ISBAR Shift Endorsement"
            subtitle="Structured Handover Formatter"
          />
        </nav>

        {/* Student Session Card */}
        <div className="pt-3 border-t border-pink-100 text-xs">
          <div className="bg-pink-50/80 p-3.5 rounded-3xl border border-pink-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold text-xs">
                🌸
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 truncate">{user.name}</div>
                <div className="text-[10px] text-pink-600 font-mono font-bold">{user.role} • {user.studentId}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 truncate mt-1 font-medium">
              Mapúa University • Health Sciences
            </div>
            <button
              onClick={handleLogout}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] bg-white hover:bg-pink-100 text-pink-600 rounded-full border border-pink-200 font-bold transition shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===================== MOBILE HEADER ===================== */}
      <header className="md:hidden flex items-center justify-between p-3.5 bg-white/95 backdrop-blur-md border-b border-pink-200 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-sm leading-tight text-slate-900">Ai Ai Delas Alas</div>
            <div className="text-[9px] text-pink-600 font-mono font-bold">Mapúa University • AADA</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="p-1.5 px-2.5 rounded-full bg-pink-500 text-white border border-pink-400 text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl bg-pink-50 text-slate-700 border border-pink-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-pink-600" /> : <Menu className="w-5 h-5 text-pink-600" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-pink-200 p-4 space-y-3 z-30 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] uppercase font-bold text-pink-800">Assigned Patient Bed</label>
              <button
                onClick={() => {
                  setShowAddPatientModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-pink-600 underline"
              >
                + Admit Bed
              </button>
            </div>
            {patients.length > 0 ? (
              <select
                value={selectedPatientId || ''}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-pink-50 border border-pink-200 text-xs text-slate-800 font-bold rounded-2xl p-2.5"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.room} - {p.name}</option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-pink-600 font-medium py-1">No patient admitted yet</div>
            )}
          </div>
          <div className="pt-2 border-t border-pink-100 text-xs flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] text-pink-600 font-mono">Mapúa University • {user.studentId}</div>
            </div>
            <button onClick={handleLogout} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full border border-pink-300 text-xs font-bold">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ===================== MAIN CLINICAL WORKSPACE ===================== */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 overflow-y-auto">
        {/* Active Patient Top Banner */}
        {currentPatient ? (
          <div className="bg-white/90 backdrop-blur-md border-b border-pink-200 px-4 py-3 sm:px-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-1.5">
                    <span>{currentPatient.name}</span>
                    <span className="text-sm">🎀</span>
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
                    {currentPatient.age} y/o • {currentPatient.gender}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-extrabold border border-rose-200">
                    {currentPatient.codeStatus}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono font-bold border border-amber-200">
                    {currentPatient.id}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong className="text-slate-800">Bed:</strong> {currentPatient.room}</span>
                  <span><strong className="text-slate-800">Dx:</strong> {currentPatient.diagnosis}</span>
                  <span><strong className="text-pink-600">Allergy:</strong> {currentPatient.allergy}</span>
                  <span><strong className="text-slate-800">Diet:</strong> {currentPatient.diet}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="bg-white hover:bg-pink-50 text-pink-600 border border-pink-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-pink-500" />
                  <span>Admit Bed</span>
                </button>
                <button
                  onClick={() => handleDischargePatient(currentPatient.id, currentPatient.name)}
                  className="bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition shadow-2xs"
                  title="Discharge patient"
                >
                  <Trash2 className="w-3.5 h-3.5 text-pink-600" />
                  <span className="hidden sm:inline">Discharge</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modules Content */}
        <div className="p-3 sm:p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {currentPatient ? (
            <>
              {activeTab === 'ehr' && (
                <SimChartModule
                  patient={currentPatient}
                  setPatients={setPatients}
                  user={user}
                  showToast={showToast}
                />
              )}

              {activeTab === 'ai_education' && (
                <AIEducationModule
                  patient={currentPatient}
                  showToast={showToast}
                />
              )}

              {activeTab === 'careplan' && (
                <CarePlanModule
                  patient={currentPatient}
                  user={user}
                  showToast={showToast}
                />
              )}

              {activeTab === 'calculator' && (
                <CalculatorModule
                  showToast={showToast}
                />
              )}

              {activeTab === 'isbar' && (
                <ISBARModule
                  patient={currentPatient}
                  user={user}
                  showToast={showToast}
                />
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-pink-300 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm shadow-pink-100 my-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-200 to-rose-200 text-pink-600 flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
                <span>Welcome to Duty, Nurse!</span>
                <span className="text-pink-500">🌸</span>
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                No active patients admitted to the roster right now. Click the cute button below to admit your first patient case!
              </p>
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-xs font-extrabold inline-flex items-center gap-2 shadow-lg shadow-pink-300 transition transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Admit First Patient Case</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ===================== MOBILE BOTTOM NAV BAR ===================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-pink-200 flex justify-around p-2 z-40 shadow-lg">
        <CuteMobileNavButton
          active={activeTab === 'ehr'}
          onClick={() => setActiveTab('ehr')}
          icon={<HeartPulse className="w-5 h-5" />}
          label="SimEHR"
        />
        <CuteMobileNavButton
          active={activeTab === 'ai_education'}
          onClick={() => setActiveTab('ai_education')}
          icon={<Sparkles className="w-5 h-5" />}
          label="AI Teach"
        />
        <CuteMobileNavButton
          active={activeTab === 'careplan'}
          onClick={() => setActiveTab('careplan')}
          icon={<BookOpen className="w-5 h-5" />}
          label="ADPIE"
        />
        <CuteMobileNavButton
          active={activeTab === 'calculator'}
          onClick={() => setActiveTab('calculator')}
          icon={<Calculator className="w-5 h-5" />}
          label="IV / Dose"
        />
        <CuteMobileNavButton
          active={activeTab === 'isbar'}
          onClick={() => setActiveTab('isbar')}
          icon={<ClipboardList className="w-5 h-5" />}
          label="ISBAR"
        />
      </nav>

      {/* ===================== ADMIT PATIENT MODAL ===================== */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-3.5 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-pink-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Admit New Patient</span>
                    <span>🎀</span>
                  </h3>
                  <p className="text-[10px] text-pink-600 font-bold">Mapúa University Clinical Simulation</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-pink-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara De Los Santos"
                    value={newPatientForm.name}
                    onChange={e => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Age & Gender *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      required
                      placeholder="Age"
                      value={newPatientForm.age}
                      onChange={e => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                    />
                    <select
                      value={newPatientForm.gender}
                      onChange={e => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-bold"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Pediatric">Pediatric</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Room & Bed Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rm 402 - Bed A"
                    value={newPatientForm.room}
                    onChange={e => setNewPatientForm({ ...newPatientForm, room: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Code Status</label>
                  <select
                    value={newPatientForm.codeStatus}
                    onChange={e => setNewPatientForm({ ...newPatientForm, codeStatus: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-bold"
                  >
                    <option value="Full Code">Full Code</option>
                    <option value="DNR (Do Not Resuscitate)">DNR (Do Not Resuscitate)</option>
                    <option value="DNR / DNI">DNR / DNI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Chief Admitting Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Gastroenteritis with moderate dehydration"
                  value={newPatientForm.diagnosis}
                  onChange={e => setNewPatientForm({ ...newPatientForm, diagnosis: e.target.value })}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Known Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g. NKDA or Penicillin"
                    value={newPatientForm.allergy}
                    onChange={e => setNewPatientForm({ ...newPatientForm, allergy: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Prescribed Diet</label>
                  <input
                    type="text"
                    placeholder="e.g. Low Salt, BRAT Diet, NPO"
                    value={newPatientForm.diet}
                    onChange={e => setNewPatientForm({ ...newPatientForm, diet: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-bold">Attending Physician</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. R. Delgado, MD"
                  value={newPatientForm.attendingPhysician}
                  onChange={e => setNewPatientForm({ ...newPatientForm, attendingPhysician: e.target.value })}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 bg-pink-50 text-slate-600 rounded-full font-bold hover:bg-pink-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-extrabold shadow-md shadow-pink-200 flex items-center gap-1.5 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Admit to SimChart Bed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CutePillNavButton({ active, onClick, icon, title, subtitle }) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left px-4 py-3 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#ff4b72] to-[#ff3b68] text-white shadow-md shadow-rose-300/50 transition flex items-center gap-3.5 transform hover:scale-[1.01]"
      >
        <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-white">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-xs tracking-wide text-white leading-tight">{title}</div>
          <div className="text-[10px] text-pink-100 mt-0.5 truncate">{subtitle}</div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-2xl sm:rounded-full bg-transparent hover:bg-pink-50/80 text-slate-700 transition flex items-center gap-3.5 border border-transparent hover:border-pink-200"
    >
      <div className="w-8 h-8 rounded-xl bg-[#ffe4ec] flex items-center justify-center shrink-0 text-[#ff4b72]">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-xs text-[#2b3952] leading-tight">{title}</div>
        <div className="text-[10px] text-[#8c9ba5] mt-0.5 truncate">{subtitle}</div>
      </div>
    </button>
  );
}

function CuteMobileNavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-1 text-[10px] transition ${
        active ? 'text-[#ff3b68] font-extrabold' : 'text-slate-400'
      }`}
    >
      <div className={`mb-0.5 ${active ? 'text-[#ff3b68]' : 'text-slate-400'}`}>{icon}</div>
      <span>{label}</span>
    </button>
  );
}

function SimChartModule({ patient, setPatients, user, showToast }) {
  // Modal states for adding vitals, orders, and I&O logs
  const [showVitalModal, setShowVitalModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddIoModal, setShowAddIoModal] = useState(false);

  // Vitals form
  const [newVital, setNewVital] = useState({
    bp: "120/80",
    hr: 78,
    rr: 18,
    temp: "36.8°C",
    spo2: "99%",
    pain: "0/10"
  });

  // Doctor's Order form
  const [newOrderForm, setNewOrderForm] = useState({
    text: "",
    type: "Routine", // "Routine" or "STAT"
    doctor: patient.attendingPhysician || "Dr. C. Mendoza, MD"
  });

  // I&O Log form
  const [newIoForm, setNewIoForm] = useState({
    type: "Intake", // "Intake" or "Output"
    source: "Oral fluids (Water / Juice)",
    amount: ""
  });

  // FDAR Quick Form States
  const [fdarFocus, setFdarFocus] = useState("");
  const [fdarData, setFdarData] = useState("");
  const [fdarAction, setFdarAction] = useState("");
  const [fdarResponse, setFdarResponse] = useState("");

  /* Vitals submission */
  const handleAddVitals = (e) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const record = {
      id: Date.now(),
      time: timeStr,
      bp: newVital.bp,
      hr: Number(newVital.hr) || 75,
      rr: Number(newVital.rr) || 18,
      temp: newVital.temp.includes('°C') ? newVital.temp : `${newVital.temp}°C`,
      spo2: newVital.spo2.includes('%') ? newVital.spo2 : `${newVital.spo2}%`,
      pain: newVital.pain.includes('/10') ? newVital.pain : `${newVital.pain}/10`,
      recordedBy: `${user ? user.name : 'SN Buquel'} (Mapúa)`
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          return { ...p, vitals: [record, ...p.vitals] };
        }
        return p;
      })
    );
    setShowVitalModal(false);
    showToast(`🌸 Vitals recorded for ${patient.name}`);
  };

  /* Add Doctor's Order */
  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!newOrderForm.text.trim()) {
      showToast("Please enter the physician's order description! 🎀");
      return;
    }
    const orderItem = {
      id: Date.now(),
      text: newOrderForm.text.trim(),
      stat: newOrderForm.type === "STAT",
      status: "Active",
      doctor: newOrderForm.doctor.trim() || "Attending MD",
      signed: true // initial verification checkbox
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          return { ...p, orders: [...(p.orders || []), orderItem] };
        }
        return p;
      })
    );
    setNewOrderForm({
      text: "",
      type: "Routine",
      doctor: patient.attendingPhysician || "Dr. C. Mendoza, MD"
    });
    setShowAddOrderModal(false);
    showToast("✨ New Doctor's Order transcribed and added!");
  };

  /* Toggle Doctor's Order check */
  const toggleOrderCheck = (orderId) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          const updated = (p.orders || []).map(o => {
            if (o.id === orderId) {
              return { ...o, signed: !o.signed };
            }
            return o;
          });
          return { ...p, orders: updated };
        }
        return p;
      })
    );
    showToast("Order status verified by Mapúa Student Nurse 🎀");
  };

  /* Delete Doctor's Order */
  const handleDeleteOrder = (orderId) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          return {
            ...p,
            orders: (p.orders || []).filter(o => o.id !== orderId)
          };
        }
        return p;
      })
    );
    showToast("Order removed from MAR chart.");
  };

  /* Add I&O Log */
  const handleAddIoLog = (e) => {
    e.preventDefault();
    const ml = parseInt(newIoForm.amount);
    if (!ml || ml <= 0) {
      showToast("Please enter a valid fluid volume in mL! 💧");
      return;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = {
      id: Date.now(),
      type: newIoForm.type, // "Intake" or "Output"
      source: newIoForm.source,
      amount: ml,
      time: timeStr
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          return {
            ...p,
            ioLogs: [newLog, ...(p.ioLogs || [])]
          };
        }
        return p;
      })
    );

    setNewIoForm({
      type: "Intake",
      source: "Oral fluids (Water / Juice)",
      amount: ""
    });
    setShowAddIoModal(false);
    showToast(`💧 ${newLog.amount} mL logged as ${newLog.type}!`);
  };

  /* Delete I&O Log */
  const handleDeleteIoLog = (logId) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          return {
            ...p,
            ioLogs: (p.ioLogs || []).filter(l => l.id !== logId)
          };
        }
        return p;
      })
    );
    showToast("Fluid log entry deleted.");
  };

  /* Calculate running Intake, Output, and Net Balance dynamically */
  const ioLogs = patient.ioLogs || [];
  const totalIntake = ioLogs
    .filter(item => item.type === "Intake")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutput = ioLogs
    .filter(item => item.type === "Output")
    .reduce((sum, item) => sum + item.amount, 0);

  const netBalance = totalIntake - totalOutput;

  /* FDAR submission */
  const handleAddFDAR = (e) => {
    e.preventDefault();
    if (!fdarFocus || !fdarData) {
      showToast("Please enter Focus and Data fields! 💕");
      return;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const note = {
      id: Date.now(),
      focus: fdarFocus,
      date: timeStr,
      author: `${user.name}, Mapúa SN`,
      data: fdarData,
      action: fdarAction,
      response: fdarResponse
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          return { ...p, fdarNotes: [note, ...p.fdarNotes] };
        }
        return p;
      })
    );
    setFdarFocus("");
    setFdarData("");
    setFdarAction("");
    setFdarResponse("");
    showToast("✨ FDAR note logged to chart!");
  };

  return (
    <div className="space-y-6">
      {/* Vitals Flowsheet & Fluid Balance (I&O) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of Vitals */}
        <div className="lg:col-span-2 bg-white border border-pink-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-pink-500" />
              <span>Vitals Flowsheet ({patient.name})</span>
            </h3>
            <button
              onClick={() => setShowVitalModal(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-sm shadow-pink-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Vitals</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fff0f5] text-pink-900 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-2.5 rounded-l-2xl">Time</th>
                  <th className="p-2.5">BP (mmHg)</th>
                  <th className="p-2.5">HR (bpm)</th>
                  <th className="p-2.5">RR (/min)</th>
                  <th className="p-2.5">Temp</th>
                  <th className="p-2.5">SpO2</th>
                  <th className="p-2.5">Pain</th>
                  <th className="p-2.5 rounded-r-2xl">Nurse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100 text-slate-700 font-mono">
                {patient.vitals.map((v) => (
                  <tr key={v.id} className="hover:bg-pink-50/50 transition">
                    <td className="p-2.5 font-bold text-slate-900">{v.time}</td>
                    <td className="p-2.5">{v.bp}</td>
                    <td className="p-2.5">{v.hr}</td>
                    <td className="p-2.5">{v.rr}</td>
                    <td className="p-2.5 text-pink-600 font-bold">{v.temp}</td>
                    <td className="p-2.5 text-rose-600 font-semibold">{v.spo2}</td>
                    <td className="p-2.5 text-pink-700 font-extrabold">{v.pain}</td>
                    <td className="p-2.5 text-slate-500 font-sans text-[11px] truncate max-w-[120px]">{v.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fluid Balance I&O Card - Addable & Empty by Default */}
        <div className="bg-white border border-pink-200 rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-pink-500" />
                <span>Fluid Intake & Output (I&O)</span>
              </h3>
              <button
                onClick={() => setShowAddIoModal(true)}
                className="bg-white hover:bg-pink-50 text-pink-600 border border-pink-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>+ Log I&O</span>
              </button>
            </div>

            {/* Live Summaries Display (Matching User's Screenshot 1 Style) */}
            <div className="space-y-3 text-xs">
              <div className="bg-[#fff0f5] p-3.5 rounded-2xl border border-pink-100">
                <div className="text-slate-600 font-medium text-xs">Total Shift Intake (Oral + IV)</div>
                <div className="text-2xl font-extrabold text-[#e11d48] font-mono mt-0.5">{totalIntake} mL</div>
              </div>

              <div className="bg-[#fff0f5] p-3.5 rounded-2xl border border-pink-100">
                <div className="text-slate-600 font-medium text-xs">Total Shift Output (Urine + Drain)</div>
                <div className="text-2xl font-extrabold text-[#e11d48] font-mono mt-0.5">{totalOutput} mL</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#ffe4ec]/80 border border-pink-200 flex justify-between items-center text-xs">
                <span className="text-pink-950 font-bold">Net Balance:</span>
                <span className={`font-mono font-extrabold text-base ${netBalance >= 0 ? 'text-pink-700' : 'text-amber-700'}`}>
                  {netBalance > 0 ? `+${netBalance}` : netBalance} mL
                </span>
              </div>
            </div>

            {/* Live Log Breakdown List */}
            <div className="mt-4 pt-3 border-t border-pink-100">
              <div className="text-[10px] font-extrabold text-pink-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Recent Fluid Entries ({ioLogs.length})</span>
                {ioLogs.length > 0 && <span className="text-slate-400 font-normal">Click ✕ to delete</span>}
              </div>

              {ioLogs.length > 0 ? (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                  {ioLogs.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-pink-50/60 p-2 rounded-xl border border-pink-100"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] font-bold ${
                          item.type === 'Intake' ? 'bg-pink-100 text-pink-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-slate-700 truncate">{item.source}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-slate-900">{item.amount} mL</span>
                        <span className="text-slate-400 text-[10px]">{item.time}</span>
                        <button
                          onClick={() => handleDeleteIoLog(item.id)}
                          className="text-pink-400 hover:text-rose-600 p-0.5"
                          title="Delete entry"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-pink-50/40 rounded-xl border border-dashed border-pink-200 text-center text-[11px] text-slate-400">
                  No fluid records yet. Click <strong>"+ Log I&O"</strong> above.
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 pt-3 border-t border-pink-100 text-[10px] text-slate-400">
            Mapúa Nursing Protocol: Monitor for fluid shifts if intake exceeds output by &gt;500 mL.
          </p>
        </div>
      </div>

      {}
      <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-pink-500" />
            <span>Doctor's Orders & MAR Verification</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddOrderModal(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Order</span>
            </button>
            <span className="hidden sm:inline text-[11px] text-pink-700 font-bold bg-pink-100 px-2.5 py-1 rounded-full font-mono">
              Mapúa Student Verified
            </span>
          </div>
        </div>

        {patient.orders && patient.orders.length > 0 ? (
          <div className="space-y-2.5">
            {patient.orders.map(order => (
              <div
                key={order.id}
                className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                  order.signed ? 'bg-pink-50/40 border-pink-100' : 'bg-white border-pink-300'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => toggleOrderCheck(order.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition border ${
                      order.signed
                        ? 'bg-pink-500 border-pink-500 text-white shadow-xs'
                        : 'border-pink-300 bg-white hover:border-pink-400 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </button>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-slate-800">{order.text}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        order.stat ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.stat ? 'STAT' : 'ROUTINE'} • {order.status}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {order.signed ? 'Verified by Student Nurse' : 'Awaiting Student Review'}
                      </span>
                      <span className="text-[10px] text-pink-600 font-medium">
                        • MD: {order.doctor || patient.attendingPhysician}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition"
                  title="Remove order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-pink-50/30 rounded-2xl border border-dashed border-pink-200">
            <ClipboardList className="w-8 h-8 text-pink-300 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-bold">No doctor's orders charted yet for this bed.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click the "+ Add Order" button above to transcribe doctor's orders.</p>
          </div>
        )}
      </div>

      {/* FDAR Clinical Progress Notes */}
      <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-2xs space-y-4">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-pink-500" />
          <span>FDAR Nurse Clinical Progress Notes</span>
        </h3>

        {/* Quick Add Form */}
        <form onSubmit={handleAddFDAR} className="bg-[#fff0f5] border border-pink-200 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-800">Add New FDAR Entry</span>
            <div className="flex gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  setFdarFocus("Hyperthermia");
                  setFdarData("Axillary temp 38.4°C, skin warm and flushed, complaining of chills.");
                  setFdarAction("Provided tepid sponge bath (TSB), advised light clothing, administered prescribed antipyretic.");
                  setFdarResponse("Temperature reduced to 37.1°C after 40 minutes. Patient resting comfortably.");
                }}
                className="px-2.5 py-1 bg-white hover:bg-pink-100 text-pink-700 font-bold rounded-full border border-pink-200 transition"
              >
                + Fever Template
              </button>
              <button
                type="button"
                onClick={() => {
                  setFdarFocus("Acute Pain");
                  setFdarData("Pain scale rated 6/10 at abdominal area. Guarding and grimacing noted.");
                  setFdarAction("Repositioned to semi-Fowler with pillow splinting. Administered analgesic as ordered.");
                  setFdarResponse("Pain score decreased to 2/10 after 30 minutes. Facial muscles relaxed.");
                }}
                className="px-2.5 py-1 bg-white hover:bg-pink-100 text-pink-700 font-bold rounded-full border border-pink-200 transition"
              >
                + Pain Template
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 block mb-1 font-bold">Focus</label>
            <input
              type="text"
              required
              value={fdarFocus}
              onChange={e => setFdarFocus(e.target.value)}
              placeholder="e.g. Fluid Volume Deficit, Pain, Hyperthermia"
              className="w-full bg-white border border-pink-200 rounded-2xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-pink-700 font-extrabold block mb-1">D (Data - Subjective & Objective)</label>
              <textarea
                rows="2"
                required
                value={fdarData}
                onChange={e => setFdarData(e.target.value)}
                placeholder="Physical signs, vitals, cues..."
                className="w-full bg-white border border-pink-200 rounded-2xl p-2 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-rose-700 font-extrabold block mb-1">A (Action - Interventions)</label>
              <textarea
                rows="2"
                required
                value={fdarAction}
                onChange={e => setFdarAction(e.target.value)}
                placeholder="Nursing interventions performed..."
                className="w-full bg-white border border-pink-200 rounded-2xl p-2 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-emerald-700 font-extrabold block mb-1">R (Response - Outcome)</label>
              <textarea
                rows="2"
                required
                value={fdarResponse}
                onChange={e => setFdarResponse(e.target.value)}
                placeholder="Patient response post-care..."
                className="w-full bg-white border border-pink-200 rounded-2xl p-2 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-xs font-bold transition shadow-sm shadow-pink-200"
            >
              Sign & Save FDAR Note
            </button>
          </div>
        </form>

        {/* Existing Notes Feed */}
        <div className="space-y-3">
          {patient.fdarNotes?.map((note) => (
            <div key={note.id} className="p-4 bg-[#fff5f8] border border-pink-100 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-pink-100 pb-1.5">
                <span className="font-extrabold text-pink-700 text-xs sm:text-sm">Focus: {note.focus}</span>
                <span className="text-[10px] text-slate-400 font-mono">{note.date} • {note.author}</span>
              </div>
              <p><strong className="text-pink-600 font-mono font-bold">D:</strong> <span className="text-slate-800">{note.data}</span></p>
              <p><strong className="text-rose-600 font-mono font-bold">A:</strong> <span className="text-slate-800">{note.action}</span></p>
              <p><strong className="text-emerald-600 font-mono font-bold">R:</strong> <span className="text-slate-800">{note.response}</span></p>
            </div>
          ))}
        </div>
      </div>

      {}
      {showAddOrderModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-pink-300 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Add Doctor's Order</h3>
                  <p className="text-[10px] text-pink-600 font-bold">{patient.name} • {patient.room}</p>
                </div>
              </div>
              <button onClick={() => setShowAddOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Physician Order Text / Medication *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Paracetamol 500mg tab PO q4h PRN for temp > 37.8°C"
                  value={newOrderForm.text}
                  onChange={e => setNewOrderForm({ ...newOrderForm, text: e.target.value })}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 focus:outline-none focus:border-pink-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Order Priority</label>
                  <select
                    value={newOrderForm.type}
                    onChange={e => setNewOrderForm({ ...newOrderForm, type: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-pink-500"
                  >
                    <option value="Routine">ROUTINE</option>
                    <option value="STAT">STAT / URGENT</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Prescribing Doctor</label>
                  <input
                    type="text"
                    value={newOrderForm.doctor}
                    onChange={e => setNewOrderForm({ ...newOrderForm, doctor: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-4 py-2 bg-pink-50 text-slate-600 rounded-full font-bold hover:bg-pink-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Transcribe Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showAddIoModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-pink-300 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Log Fluid Intake / Output</h3>
                  <p className="text-[10px] text-pink-600 font-bold">{patient.name} • {patient.room}</p>
                </div>
              </div>
              <button onClick={() => setShowAddIoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddIoLog} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Fluid Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewIoForm({ ...newIoForm, type: "Intake", source: "Oral fluids (Water / Juice)" })}
                    className={`py-2 rounded-2xl font-bold border transition text-xs ${
                      newIoForm.type === 'Intake'
                        ? 'bg-pink-500 border-pink-500 text-white shadow-xs'
                        : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300'
                    }`}
                  >
                    💧 INTAKE (In)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewIoForm({ ...newIoForm, type: "Output", source: "Urine Voided / Catheter" })}
                    className={`py-2 rounded-2xl font-bold border transition text-xs ${
                      newIoForm.type === 'Output'
                        ? 'bg-rose-500 border-rose-500 text-white shadow-xs'
                        : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300'
                    }`}
                  >
                    🚽 OUTPUT (Out)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Source / Category *</label>
                {newIoForm.type === "Intake" ? (
                  <select
                    value={newIoForm.source}
                    onChange={e => setNewIoForm({ ...newIoForm, source: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-pink-500"
                  >
                    <option value="Oral fluids (Water / Juice)">Oral fluids (Water / Juice / Broth)</option>
                    <option value="IV Infusion (D5W / NSS / LR)">IV Infusion (D5W / 0.9% NSS / LR)</option>
                    <option value="Enteral / NGT Feeding">Enteral Tube / NGT Feeding</option>
                    <option value="Blood Product Infusion">Blood Product Infusion</option>
                    <option value="Medication Flushes">Medication Flushes</option>
                  </select>
                ) : (
                  <select
                    value={newIoForm.source}
                    onChange={e => setNewIoForm({ ...newIoForm, source: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-pink-500"
                  >
                    <option value="Urine Voided / Catheter">Urine Voided / Foley Catheter</option>
                    <option value="Surgical Wound Drain (JP/Hemovac)">Surgical Wound Drain (JP / Hemovac)</option>
                    <option value="Emesis / Vomitus">Emesis / Vomitus</option>
                    <option value="Nasogastric Tube (NGT) Suction">Nasogastric Tube (NGT) Suction</option>
                    <option value="Liquid Stool / Diarrhea">Liquid Stool / Diarrhea</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Volume Amount (mL) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 250"
                  value={newIoForm.amount}
                  onChange={e => setNewIoForm({ ...newIoForm, amount: e.target.value })}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setShowAddIoModal(false)}
                  className="px-4 py-2 bg-pink-50 text-slate-600 rounded-full font-bold hover:bg-pink-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Fluid Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Vitals Modal Form */}
      {showVitalModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="bg-white border border-pink-200 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-pink-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-pink-500" />
                <span>Log Duty Vitals ({patient.name})</span>
              </h3>
              <button onClick={() => setShowVitalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVitals} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    required
                    value={newVital.bp}
                    onChange={e => setNewVital({ ...newVital, bp: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    required
                    value={newVital.hr}
                    onChange={e => setNewVital({ ...newVital, hr: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Resp. Rate (/min)</label>
                  <input
                    type="number"
                    required
                    value={newVital.rr}
                    onChange={e => setNewVital({ ...newVital, rr: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Temperature (°C)</label>
                  <input
                    type="text"
                    required
                    value={newVital.temp}
                    onChange={e => setNewVital({ ...newVital, temp: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="text"
                    required
                    value={newVital.spo2}
                    onChange={e => setNewVital({ ...newVital, spo2: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Pain Score (0-10)</label>
                  <input
                    type="text"
                    required
                    value={newVital.pain}
                    onChange={e => setNewVital({ ...newVital, pain: e.target.value })}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVitalModal(false)}
                  className="px-3.5 py-1.5 bg-pink-50 text-slate-600 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs font-bold shadow-xs"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AIEducationModule({ patient, showToast }) {
  const [jargonInput, setJargonInput] = useState(
    `Patient ${patient.name} admitted with ${patient.diagnosis}. Maintain clean, dry dressings over portal surgical sites. Proscribe strenuous valsalva and heavy lifting greater than 10 lbs for 3 weeks. Ambulate cautiously to dispel retained pneumoperitoneum. Follow up in 7 days for surgical suture evaluation.`
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [educationOutput, setEducationOutput] = useState("");
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Can you demonstrate how to support your belly with a pillow when coughing?", checked: false },
    { id: 2, text: "What warning signs tell you or your family to call the clinic right away?", checked: false },
    { id: 3, text: "How much weight are you allowed to carry over the next three weeks?", checked: false }
  ]);

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setEducationOutput(
        `Easy-to-Read Home Care Instructions for ${patient.name}\n\n` +
        "1. Incisions & Bandages: Keep your surgical bandages completely clean and dry. Avoid taking tub baths or soaking in water until your doctor says it is safe.\n\n" +
        "2. Walking & Daily Activity: Take short, gentle walks around your house several times each day. Walking prevents leg clots and eases belly gas. Do not carry anything heavier than 10 lbs (like a heavy bag of groceries) for 3 weeks.\n\n" +
        "3. Managing Incision Pain: Take your prescribed pain medication with a light snack. Hold a soft pillow against your stomach when coughing or getting out of bed.\n\n" +
        "4. Red Flags (Contact Your Doctor Immediately):\n" +
        "• Fever higher than 38.0°C (100.4°F) or severe chills\n" +
        "• Redness, swelling, or bad-smelling fluid around your cuts\n" +
        "• Severe pain that does not improve after taking your medicine\n" +
        "• Yellowing of your skin or the whites of your eyes"
      );
      setIsTranslating(false);
      showToast("🌸 AADA Health Teacher generated 6th-grade instructions!");
    }, 700);
  };

  const toggleCheck = (id) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(educationOutput);
    showToast("✨ Discharge instructions copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-3xl p-6 text-white shadow-md shadow-pink-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">Ai Ai Delas Alas (AADA) Health Teacher</h2>
            <p className="text-xs text-pink-100 mt-0.5">
              Mapúa Student Nursing Tool: Converts complex medical jargon into 6th-grade level patient guides.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Clinical Orders */}
        <div className="bg-white border border-pink-200 rounded-3xl p-5 space-y-4 shadow-2xs">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Physician Discharge Notes & Orders
            </label>
            <textarea
              rows="5"
              value={jargonInput}
              onChange={e => setJargonInput(e.target.value)}
              className="w-full bg-[#fff0f5] border border-pink-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Reading Level: 6th Grade Plain Language</span>
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 shadow-md shadow-pink-200"
            >
              {isTranslating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isTranslating ? "Translating..." : "Generate Patient Handout"}</span>
            </button>
          </div>

          {/* Teach-Back Checklist */}
          <div className="pt-4 border-t border-pink-100 space-y-3">
            <div className="flex items-center gap-2 text-pink-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bedside Teach-Back Verification Checklist</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Confirm patient understanding before discharge sign-off:
            </p>
            <div className="space-y-2 text-xs">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-start gap-2.5 transition ${
                    item.checked
                      ? 'bg-pink-50 border-pink-300 text-pink-900'
                      : 'bg-white border-pink-100 text-slate-700 hover:border-pink-200'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    item.checked ? 'bg-pink-500 border-pink-500 text-white' : 'border-pink-300 bg-white'
                  }`}>
                    {item.checked && <Check className="w-3 h-3 font-bold" />}
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Output */}
        <div className="bg-white border border-pink-200 rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex justify-between items-center border-b border-pink-100 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">AADA Health Literacy Verified</span>
                <h3 className="text-sm font-bold text-slate-900">Discharge Guide for {patient.name}</h3>
              </div>
              {educationOutput && (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-full text-xs flex items-center gap-1.5 border border-pink-200 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Handout</span>
                </button>
              )}
            </div>

            {educationOutput ? (
              <div className="p-4 bg-[#fff5f8] rounded-2xl border border-pink-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                {educationOutput}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 text-xs border border-dashed border-pink-200 rounded-2xl">
                Click "Generate Patient Handout" to produce plain-language discharge teaching guidelines.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-pink-100 text-[10px] text-slate-400 flex justify-between font-medium">
            <span>Mapúa University Health Informatics</span>
            <span>AADA Clinical Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarePlanModule({ patient, user, showToast }) {
  const [adpieState, setAdpieState] = useState({
    assessment: `Subjective: Patient ${patient.name} verbalizes discomfort.\nObjective: Guarding noted upon movement, vitals recorded within parameters.`,
    diagnosis: `Acute Pain related to surgical tissue disruption secondary to ${patient.diagnosis} as evidenced by verbal report and guarding behavior.`,
    plan: "Within 45 minutes of nursing interventions, patient will report a decrease in pain score to 3/10 or below and appear visibly comfortable.",
    intervention: "1. Administer prescribed analgesia as scheduled.\n2. Position in semi-Fowler position with knees comfortably supported.\n3. Demonstrate slow diaphragmatic breathing and pillow splinting over incisions.",
    rationales: "1. Inhibits pain pathway neurotransmission.\n2. Minimizes abdominal musculature tension.\n3. Reduces incision stretch during coughing and respiration.",
    evaluation: "Goal met. Patient reported pain reduction to 2/10 30 minutes post-intervention with relaxed posture."
  });

  const handleCopyNCP = () => {
    const text = `MAPÚA UNIVERSITY - NURSING CARE PLAN (ADPIE)\nPatient: ${patient.name} (${patient.room})\nStudent Nurse: ${user.name} (${user.studentId})\n\n[ASSESSMENT]\n${adpieState.assessment}\n\n[NURSING DIAGNOSIS]\n${adpieState.diagnosis}\n\n[PLANNING (SMART GOAL)]\n${adpieState.plan}\n\n[INTERVENTIONS]\n${adpieState.intervention}\n\n[SCIENTIFIC RATIONALES]\n${adpieState.rationales}\n\n[EVALUATION]\n${adpieState.evaluation}`;
    navigator.clipboard.writeText(text);
    showToast("✨ Complete NCP copied to clipboard!");
  };

  return (
    <div className="bg-white border border-pink-200 rounded-3xl p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            <span>ADPIE Nursing Care Plan Builder ({patient.name})</span>
          </h3>
          <p className="text-xs text-pink-700 font-medium">Mapúa Academic Standard NCP with Scientific Rationales</p>
        </div>
        <button
          onClick={handleCopyNCP}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition self-start shadow-md shadow-pink-200"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Complete NCP</span>
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div className="bg-[#fff0f5] p-4 rounded-2xl border border-pink-200">
          <label className="text-pink-800 font-extrabold block mb-1">A - Assessment Data (Cues)</label>
          <textarea
            rows="3"
            value={adpieState.assessment}
            onChange={e => setAdpieState({ ...adpieState, assessment: e.target.value })}
            className="w-full bg-white border border-pink-200 rounded-2xl p-2.5 text-slate-800 focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="bg-[#fff0f5] p-4 rounded-2xl border border-pink-200">
          <label className="text-pink-800 font-extrabold block mb-1">D - Nursing Diagnosis (NANDA Format)</label>
          <textarea
            rows="2"
            value={adpieState.diagnosis}
            onChange={e => setAdpieState({ ...adpieState, diagnosis: e.target.value })}
            className="w-full bg-white border border-pink-200 rounded-2xl p-2.5 text-slate-800 focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="bg-[#fff0f5] p-4 rounded-2xl border border-pink-200">
          <label className="text-pink-800 font-extrabold block mb-1">P - Planning (SMART Goal)</label>
          <textarea
            rows="2"
            value={adpieState.plan}
            onChange={e => setAdpieState({ ...adpieState, plan: e.target.value })}
            className="w-full bg-white border border-pink-200 rounded-2xl p-2.5 text-slate-800 focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#fff0f5] p-4 rounded-2xl border border-pink-200">
            <label className="text-pink-800 font-extrabold block mb-1">I - Nursing Interventions</label>
            <textarea
              rows="4"
              value={adpieState.intervention}
              onChange={e => setAdpieState({ ...adpieState, intervention: e.target.value })}
              className="w-full bg-white border border-pink-200 rounded-2xl p-2.5 text-slate-800 focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="bg-[#fff0f5] p-4 rounded-2xl border border-pink-200">
            <label className="text-pink-800 font-extrabold block mb-1">Scientific Rationales</label>
            <textarea
              rows="4"
              value={adpieState.rationales}
              onChange={e => setAdpieState({ ...adpieState, rationales: e.target.value })}
              className="w-full bg-white border border-pink-200 rounded-2xl p-2.5 text-slate-800 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div className="bg-[#fff0f5] p-4 rounded-2xl border border-pink-200">
          <label className="text-emerald-800 font-extrabold block mb-1">E - Evaluation</label>
          <textarea
            rows="2"
            value={adpieState.evaluation}
            onChange={e => setAdpieState({ ...adpieState, evaluation: e.target.value })}
            className="w-full bg-white border border-pink-200 rounded-2xl p-2.5 text-slate-800 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>
    </div>
  );
}

function CalculatorModule({ showToast }) {
  // IV Flow Rate States
  const [ivVolume, setIvVolume] = useState(1000);
  const [ivHours, setIvHours] = useState(8);
  const [dropFactor, setDropFactor] = useState(20);

  // Drug Dosage States (D / H * Q)
  const [doseDesired, setDoseDesired] = useState(500);
  const [doseHave, setDoseHave] = useState(250);
  const [doseQuantity, setDoseQuantity] = useState(5);

  const calculatedMlPerHour = ivHours > 0 ? (ivVolume / ivHours).toFixed(1) : 0;
  const calculatedGttsPerMin = ivHours > 0 ? Math.round((ivVolume * dropFactor) / (ivHours * 60)) : 0;
  const calculatedDose = doseHave > 0 ? ((doseDesired / doseHave) * doseQuantity).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* IV Flow Rate Calculator */}
      <div className="bg-white border border-pink-200 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-pink-500 animate-bounce" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">IV Drip & Flow Rate Calculator</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-600 font-bold block mb-1">Total Infusion Volume (mL)</label>
            <input
              type="number"
              value={ivVolume}
              onChange={e => setIvVolume(Number(e.target.value))}
              className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 font-bold block mb-1">Infusion Time (Hours)</label>
            <input
              type="number"
              step="0.5"
              value={ivHours}
              onChange={e => setIvHours(Number(e.target.value))}
              className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 font-bold block mb-1">Set Drop Factor Calibration</label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 20, 60].map(factor => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => setDropFactor(factor)}
                  className={`py-2 rounded-full font-bold border transition text-xs ${
                    dropFactor === factor
                      ? 'bg-pink-500 border-pink-500 text-white shadow-xs'
                      : 'bg-pink-50 border-pink-200 text-slate-700 hover:border-pink-400'
                  }`}
                >
                  {factor} {factor === 60 ? 'micro' : 'gtt'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#fff0f5] border border-pink-200 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Infusion Pump Rate:</span>
            <span className="text-xl font-mono font-extrabold text-pink-600">{calculatedMlPerHour} mL/hr</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Gravity Drip Rate:</span>
            <span className="text-xl font-mono font-extrabold text-rose-600">{calculatedGttsPerMin} gtts/min</span>
          </div>
        </div>
      </div>

      {/* Medication Dosage Formula (D/H * Q) */}
      <div className="bg-white border border-pink-200 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-pink-500" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Drug Dosage Calculator (D / H × Q)</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-600 font-bold block mb-1">Desired Dose (D)</label>
            <input
              type="number"
              value={doseDesired}
              onChange={e => setDoseDesired(Number(e.target.value))}
              className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 font-bold block mb-1">Dose on Hand / Stock (H)</label>
            <input
              type="number"
              value={doseHave}
              onChange={e => setDoseHave(Number(e.target.value))}
              className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 font-bold block mb-1">Quantity / Vehicle (Q - mL or tab)</label>
            <input
              type="number"
              value={doseQuantity}
              onChange={e => setDoseQuantity(Number(e.target.value))}
              className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl p-2.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        <div className="p-4 bg-[#fff0f5] border border-pink-200 rounded-2xl">
          <div className="text-xs text-slate-600 mb-1 font-medium">Amount to Administer:</div>
          <div className="text-2xl font-mono font-extrabold text-pink-600">{calculatedDose} mL / Units</div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            Calculation: ({doseDesired} ÷ {doseHave}) × {doseQuantity} = {calculatedDose}
          </div>
        </div>
      </div>
    </div>
  );
}

function ISBARModule({ patient, user, showToast }) {
  const latestVital = patient.vitals?.[0] || {};
  const isbarText =
    `--- MAPÚA UNIVERSITY ISBAR CLINICAL ENDORSEMENT ---\n` +
    `[I] INTRODUCTION: Handover by Student Nurse ${user.name} (${user.studentId}), Mapúa University School of Health Sciences.\n` +
    `[S] SITUATION: Patient ${patient.name}, ${patient.age} y/o in ${patient.room}. Admitted for ${patient.diagnosis}. Code Status: ${patient.codeStatus}.\n` +
    `[B] BACKGROUND: Attending Physician: ${patient.attendingPhysician}. Allergies: ${patient.allergy}. Diet: ${patient.diet}.\n` +
    `[A] ASSESSMENT: Latest vitals at ${latestVital.time || 'Current Time'}: BP ${latestVital.bp}, HR ${latestVital.hr} bpm, Temp ${latestVital.temp}, SpO2 ${latestVital.spo2}, Pain ${latestVital.pain}.\n` +
    `[R] RECOMMENDATION: Re-assess pain relief within 30 minutes, maintain incentive spirometry hourly, and verify pending doctor orders.\n` +
    `----------------------------------------------------`;

  const handleCopy = () => {
    navigator.clipboard.writeText(isbarText);
    showToast("🌸 ISBAR handover endorsement copied!");
  };

  return (
    <div className="bg-white border border-pink-200 rounded-3xl p-6 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-pink-500" />
            <span>ISBAR Clinical Handover ({patient.name})</span>
          </h3>
          <p className="text-xs text-slate-500">Structured communication format for shift endorsement</p>
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition self-start shadow-md shadow-pink-200"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Script</span>
        </button>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="p-4 bg-[#fff0f5] border border-pink-200 rounded-2xl">
          <span className="text-pink-800 font-extrabold block mb-1">[I] INTRODUCTION</span>
          <p className="text-slate-800 font-sans">
            "This is Student Nurse {user.name} ({user.studentId}) from Mapúa University endorsing {patient.name}, {patient.age} years old in {patient.room}."
          </p>
        </div>

        <div className="p-4 bg-[#fff0f5] border border-pink-200 rounded-2xl">
          <span className="text-rose-800 font-extrabold block mb-1">[S] SITUATION</span>
          <p className="text-slate-800 font-sans">
            "Admitted with {patient.diagnosis}. Code status is currently {patient.codeStatus}."
          </p>
        </div>

        <div className="p-4 bg-[#fff0f5] border border-pink-200 rounded-2xl">
          <span className="text-pink-800 font-extrabold block mb-1">[B] BACKGROUND</span>
          <p className="text-slate-800 font-sans">
            "Allergies recorded: {patient.allergy}. Diet is {patient.diet}. Attending Physician: {patient.attendingPhysician}."
          </p>
        </div>

        <div className="p-4 bg-[#fff0f5] border border-pink-200 rounded-2xl">
          <span className="text-rose-900 font-extrabold block mb-1">[A] ASSESSMENT</span>
          <p className="text-slate-800 font-sans">
            "Latest vitals recorded at {latestVital.time || 'Current'}: BP {latestVital.bp}, HR {latestVital.hr} bpm, Temp {latestVital.temp}, SpO2 {latestVital.spo2}, Pain {latestVital.pain}."
          </p>
        </div>

        <div className="p-4 bg-[#fff0f5] border border-pink-200 rounded-2xl">
          <span className="text-emerald-800 font-extrabold block mb-1">[R] RECOMMENDATION</span>
          <p className="text-slate-800 font-sans">
            "Continue IV fluid infusion as scheduled, monitor intake and output balance, and re-assess comfort."
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("Claire Antonette Buquel");
  const [email, setEmail] = useState("claire.buquel@mymail.mapua.edu.ph");
  const [password, setPassword] = useState("••••••••");
  const [studentId, setStudentId] = useState("2023-149021-MN");
  const [role, setRole] = useState("Student Nurse");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: name || "Student Nurse Claire",
      email,
      studentId,
      role,
      institution: "Mapúa University - School of Health Sciences"
    });
  };

  const handleDemoFill = () => {
    setName("Claire Antonette Buquel");
    setEmail("claire.buquel@mymail.mapua.edu.ph");
    setStudentId("2023-149021-MN");
    setRole("Student Nurse");
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] flex flex-col items-center justify-center p-4 text-slate-800 font-sans">
      <div className="w-full max-w-md bg-white border border-pink-200 rounded-3xl shadow-xl shadow-pink-200/50 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-400 to-rose-400 shadow-md shadow-pink-200 mb-3 border border-white">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-1.5">
            <span>Ai Ai Delas Alas</span>
            <span>🌸</span>
          </h1>
          <div className="inline-block px-3 py-0.5 rounded-full bg-pink-100 text-pink-700 font-mono text-xs font-bold tracking-wider my-1 border border-pink-200">
            AADA CLINICAL SUITE
          </div>
          <p className="text-xs text-rose-500 font-semibold">
            Mapúa University Student Affiliation • Clinical Duty Portal
          </p>
        </div>

        {/* Tab switch between Sign In and Sign Up */}
        <div className="flex bg-[#fff0f5] p-1 rounded-full border border-pink-200 mb-4">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 py-2 text-xs font-bold rounded-full transition ${
              !isSignUp ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 py-2 text-xs font-bold rounded-full transition ${
              isSignUp ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-700 block mb-1 font-bold">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
              placeholder="Claire Antonette Buquel"
            />
          </div>

          <div>
            <label className="text-slate-700 block mb-1 font-bold">Mapúa Institutional Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
              placeholder="claire.buquel@mymail.mapua.edu.ph"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 block mb-1 font-bold">Student ID</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1 font-bold">Clinical Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-bold"
              >
                <option value="Student Nurse">Student Nurse</option>
                <option value="Clinical Instructor">Clinical Instructor</option>
                <option value="Staff Nurse (RN)">Staff Nurse (RN)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 block mb-1 font-bold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm shadow-md shadow-pink-200 transition flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch AADA Clinical Session 💕</span>
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-pink-100 flex justify-between items-center text-xs text-slate-500">
          <span>Mapúa University Portal</span>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-pink-600 hover:underline font-bold"
          >
            Fill Mapúa Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}