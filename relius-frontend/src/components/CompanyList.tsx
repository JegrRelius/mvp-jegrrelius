import React from 'react';
// 1. Importamos 'Link' para crear enlaces de navegación
import { Link } from 'react-router-dom';

interface Company {
  id: string;
  name: string;
}

interface CompanyListProps {
  companies: Company[];
}

const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  if (companies.length === 0) {
    return <p>No hay empresas creadas todavía.</p>;
  }

  return (
    <div className="company-list-container">
      <h3>Empresas Registradas</h3>
      <table className="company-table">
        <thead>
          <tr>
            <th>Nombre de la Empresa</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>
                {/* 2. Convertimos el nombre en un enlace */}
                <Link to={`/empresa/${company.id}`}>
                  {company.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;