import { Clock, MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-vdm-primary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Info */}
          <div>
            <h3 className="font-heading text-2xl text-vdm-secondary mb-4">Viña del Mal</h3>
            <p className="text-vdm-text-muted text-sm leading-relaxed mb-6">
              Plataforma SaaS Multi-tenant exclusiva para botillerías independientes de Chile. 
              Selección premium para gustos exigentes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-vdm-surface flex items-center justify-center text-vdm-text-muted hover:bg-vdm-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-vdm-surface flex items-center justify-center text-vdm-text-muted hover:bg-vdm-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="font-heading text-lg text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-vdm-primary" />
              Horarios de Atención
            </h4>
            <ul className="space-y-3 text-sm text-vdm-text-muted">
              <li className="flex justify-between border-b border-vdm-surface pb-2">
                <span>Lunes a Miércoles</span>
                <span>10:00 - 00:00</span>
              </li>
              <li className="flex justify-between border-b border-vdm-surface pb-2">
                <span>Jueves a Sábado</span>
                <span>10:00 - 02:00</span>
              </li>
              <li className="flex justify-between border-b border-vdm-surface pb-2 text-vdm-primary font-medium">
                <span>Domingo</span>
                <span>CERRADO</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-heading text-lg text-white mb-4">Contacto</h4>
            <ul className="space-y-4 text-sm text-vdm-text-muted">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-vdm-primary shrink-0 mt-0.5" />
                <span>Av. Providencia 1234, Local 5<br/>Santiago, Chile</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-vdm-primary shrink-0" />
                <span>+56 9 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Bottom */}
        <div className="pt-8 border-t border-vdm-surface text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-vdm-text-muted">
            © {new Date().getFullYear()} Viña del Mal. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-vdm-text-muted">
            <Link href="#" className="hover:text-vdm-secondary transition-colors">Términos y Condiciones</Link>
            <Link href="#" className="hover:text-vdm-secondary transition-colors">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
