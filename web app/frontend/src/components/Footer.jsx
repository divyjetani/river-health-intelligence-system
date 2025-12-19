import { Twitter, Github, Linkedin, Droplet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-100/50 to-cyan-100/50 border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Team Cosmix
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              AI-powered river health intelligence for a sustainable future
            </p>
            <div className="flex space-x-3">
              <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <Github className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Research Papers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-600">
            2024 Team Cosmix. Clean Energy & Sustainability Initiative.
          </p>
        </div>
      </div>
    </footer>
  );
}
