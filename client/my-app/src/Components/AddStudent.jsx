import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import './AddStudent.css';

const AddStudent = ({ claseId }) => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [alumnoId, setAlumnoId] = useState('');
    const [signed, setSigned] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get("/getAlumnos");
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSigned(false);
        setError(false);
        try {
            const response = await axiosInstance.post("/signAlumnoToClass", {
                alumnoId,
                claseId
            });
            if(response.status === 200){
                setSigned(true);
            }
        } catch (error) {
            setError(true);
            console.error("Error when signing student to class", error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAlumnoIdChange = (event) => {
        setAlumnoId(event.target.value);
    };

    const filteredStudents = students.filter(student => {
        const nombre_usuario = student.nombre_usuario || '';
        const correo = student.correo || '';
        const clases = student.clases || [];

        return nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clases.some(clase => (clase.nombreClase || '').toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <div className="container d-col">
            <div className="container-custom">
                <h2 className="my-4">Add Student to Class</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Alumno ID:</label>
                        <input
                            type="text"
                            name="alumnoId"
                            className="form-control"
                            value={alumnoId}
                            onChange={handleAlumnoIdChange}
                        />
                    </div>
                    <div className="form-group p-15">
                        <label>Clase ID:</label>
                        <input type="text" name="claseId" value={claseId} readOnly className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary">Agregar Alumno</button>
                    {signed && <p className="text-success mt-2">El estudiante se dio de alta correctamente.</p>}
                    {error && <p className="text-danger mt-2">Error al dar de alta al estudiante.</p>}
                </form>
            </div>
            <div className="container-custom">
                <h2 className="my-4">Student List</h2>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div className="table-responsive table-border">
                    <table className="table table-striped table-custom-bg">
                        <thead className="thead-dark">
                            <tr>
                                <th>User Id</th>
                                <th>Student Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Classes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.usuarioId}>
                                    <td>{student.usuarioId}</td>
                                    <td>{student.alumnoId}</td>
                                    <td>{student.nombre_usuario}</td>
                                    <td>{student.correo}</td>
                                    <td>
                                        <ul className="list-group">
                                            {student.clases.map((clase, index) => (
                                                <li key={index} className="list-group-item">{clase.nombreClase ? `${clase.nombreClase} (ID: ${clase.claseId})` : "No asignado"}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddStudent;
