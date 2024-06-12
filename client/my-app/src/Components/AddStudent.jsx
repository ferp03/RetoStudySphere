import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import './AddStudent.css';

const AddStudent = ({ claseId }) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get('/getAlumnos');
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    console.log(students)

    return (
        <div className="container">
            <h2 className="my-4">Student List</h2>
            <div className="table-responsive">
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
                        {students.map(student => (
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

            <h2 className="my-4">Agregar Alumno</h2>
            <form className="form">
                <div className="form-group">
                    <label>Alumno ID:</label>
                    <input type="text" name="alumnoId" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Clase ID:</label>
                    <input type="text" name="claseId" value={claseId} readOnly className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Alumno</button>
            </form>
        </div>
    );
};

export default AddStudent;
