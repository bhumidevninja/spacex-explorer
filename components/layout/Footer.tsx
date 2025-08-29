import { Rocket, Github, Twitter, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Rocket className="w-6 h-6 text-purple-400" />
              <span className="font-bold text-lg gradient-text">
                SpaceX Explorer
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {`Explore the cosmos through SpaceX's groundbreaking missions and
              achievements.`}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Launches
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Statistics
                </a>
              </li>
              <li>
                <a
                  href="/compare"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Compare
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/r-spacex/SpaceX-API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  SpaceX API
                </a>
              </li>
              <li>
                <a
                  href="https://www.spacex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Official Website
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/spacex"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-purple-400" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-purple-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 SpaceX Explorer. Not affiliated with SpaceX. Made with 💜 for
            space enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
