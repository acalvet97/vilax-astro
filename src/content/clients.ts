/**
 * Client logos ("Ya confían en VILAX"). Same files as production
 * (www.vilax.es/wp-content/uploads/2026/07/*-logo-scaled.png): light logos on a
 * transparent 2560×765 canvas, made for dark backgrounds.
 *
 * Order matters: the first four are shown on load (as in Figma), the rest
 * rotate in. To add a client: drop a logo with the same canvas in
 * src/assets/clients/ and add it here.
 */
import ajuntamentSantBoi from '../assets/clients/ajuntament-sant-boi.png';
import ajuntamentViladecans from '../assets/clients/ajuntament-viladecans.png';
import bugaboo from '../assets/clients/bugaboo.png';
import interflon from '../assets/clients/interflon.png';
import mesoestetic from '../assets/clients/mesoestetic.png';
import nestle from '../assets/clients/nestle.png';
import proteinK from '../assets/clients/protein-k.png';
import radheShyam from '../assets/clients/radhe-shyam.png';
import tgt from '../assets/clients/tgt.png';
import universitatBarcelona from '../assets/clients/universitat-barcelona.png';

export type Client = { name: string; logo: ImageMetadata };

export const clients: Client[] = [
  { name: 'Nestlé', logo: nestle },
  { name: 'Ajuntament de Viladecans', logo: ajuntamentViladecans },
  { name: 'Bugaboo', logo: bugaboo },
  { name: 'Universitat de Barcelona', logo: universitatBarcelona },
  { name: 'Mesoestetic', logo: mesoestetic },
  { name: 'Interflon', logo: interflon },
  { name: 'Ajuntament de Sant Boi', logo: ajuntamentSantBoi },
  { name: 'ProteinK', logo: proteinK },
  { name: 'Radhe Shyam', logo: radheShyam },
  { name: 'Tgt', logo: tgt },
];
