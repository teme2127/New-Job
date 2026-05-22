import React from 'react';

// Resume data type
interface ResumeEntry {
  nome: string;
  sobre: string;
  idade: number;
  estado: string;
  cidade: string;
  cargoPretendido: string;
  trabalho: string;
  email: string;
  whatsapp: string;
  hardSkills?: string[];
  softSkills?: string[];
  projetos?: { nome: string; link?: string }[];
  github?: string;
  linkedin?: string;
}

const resumeData: ResumeEntry = {
  nome: 'Alexandre',
  sobre: 'Souza',
  idade: 44,
  estado: 'MG',
  cidade: 'Jesuânia',
  cargoPretendido: 'Desenvolvedor Web PHP Junior',
  trabalho: 'Remota',
  email: 'alexandresousaroberto@gmail.com',
  whatsapp: '(35)9-98464219',
  hardSkills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'React', 'Next.js'],
  softSkills: ['Comunicação', 'Trabalho em equipe', 'Proatividade'],
  projetos: [
    { nome: 'Projeto-01', link: '#' },
    { nome: 'Projeto-02', link: '#' }
  ],
  github: 'https://github.com/teme2127',
  linkedin: 'https://www.linkedin.com/in/alexandre-souza/'
};

export const Resume: React.FC = () => {
  const r = resumeData;
  return (
    <section className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Currículo</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Sobrenome</th>
            <th className="p-2 border">Idade</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Cidade</th>
            <th className="p-2 border">Cargo Pretendido</th>
            <th className="p-2 border">Tipo de Trabalho</th>
            <th className="p-2 border">E‑mail</th>
            <th className="p-2 border">WhatsApp</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100 transition-colors">
            <td className="p-2 border text-center">{r.nome}</td>
            <td className="p-2 border text-center">{r.sobre}</td>
            <td className="p-2 border text-center">{r.idade}</td>
            <td className="p-2 border text-center">{r.estado}</td>
            <td className="p-2 border text-center">{r.cidade}</td>
            <td className="p-2 border text-center">{r.cargoPretendido}</td>
            <td className="p-2 border text-center">{r.trabalho}</td>
            <td className="p-2 border text-center break-all">
              <a href={`mailto:${r.email}`} className="text-indigo-600 hover:underline">{r.email}</a>
            </td>
            <td className="p-2 border text-center">
              <a href={`https://wa.me/${r.whatsapp.replace(/\\D/g, '')}`} className="text-green-600 hover:underline">{r.whatsapp}</a>
            </td>
          </tr>
        </tbody>
      </table>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Hard Skills</h2>
        <ul className="list-disc list-inside flex flex-wrap gap-2">
          {r.hardSkills?.map((s) => (
            <li key={s} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Soft Skills</h2>
        <ul className="list-disc list-inside flex flex-wrap gap-2">
          {r.softSkills?.map((s) => (
            <li key={s} className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Projetos</h2>
        <ul className="list-disc list-inside flex flex-col gap-1">
          {r.projetos?.map((p) => (
            <li key={p.nome}>
              <a href={p.link} className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">{p.nome}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 flex gap-4">
        <a href={r.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
        <a href={r.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
      </section>
    </section>
  );
};
