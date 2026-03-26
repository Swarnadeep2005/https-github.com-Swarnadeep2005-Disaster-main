const {
  ExternalLink,
  Radar,
  Github,
  Code,
  Server,
  Cpu,
  Layers,
  Database,
} = require("lucide-react");

function Footer() {
  const stack = [
    { icon: Code, name: "Next.js", role: "Frontend" },
    { icon: Server, name: "FastAPI", role: "Backend" },
    { icon: Cpu, name: "Scikit-Learn", role: "ML" },
    { icon: Layers, name: "Tailwind CSS", role: "Styling" },
    { icon: Database, name: "Random Forest", role: "Model" },
  ];

  return (
    <footer className="bg-[#050a0e] border-t border-white/[0.05] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/25 rounded-lg flex items-center justify-center">
                <Radar className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-white text-sm">
                Disas<span className="text-emerald-400">terAI</span>
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-xs">
              An ML-powered system for classifying natural disasters using
              geographic and magnitude features, trained on the EM-DAT global
              disaster database.
            </p>
          </div>

          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-5">
              Technology Stack
            </p>
            <div className="grid grid-cols-2 gap-2">
              {stack.map(({ icon: Icon, name, role }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-slate-400">{name}</span>
                  <span className="text-slate-700 text-[10px]">· {role}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-5">
              Links
            </p>
            <div className="space-y-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors text-xs font-medium"
              >
                <Github className="w-3.5 h-3.5" /> View on GitHub
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              <a
                href="https://emdat.be"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors text-xs font-medium"
              >
                <Database className="w-3.5 h-3.5" /> EM-DAT Database
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-700 text-xs font-mono">
            © {new Date().getFullYear()} DisasterAI · Built with Next.js +
            FastAPI + Random Forest
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Model · Live
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
