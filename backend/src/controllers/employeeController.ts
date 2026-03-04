import type { Request, Response } from 'express';
import { db } from '../models/data.js';
import type { Employee } from '../models/data.js';

export const getEmployees = async (_req: Request, res: Response) => {
    res.json(db.employees);
};

export const createEmployee = async (req: Request, res: Response) => {
    const employeeData = req.body;
    const newEmployee: Employee = {
        ...employeeData,
        id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active'
    };
    db.employees.push(newEmployee);
    res.status(201).json(newEmployee);
};

export const updateEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const index = db.employees.findIndex(emp => emp.id === id);
    if (index === -1) return res.status(404).json({ message: 'Employee not found' });

    const employee = db.employees[index];
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const updatedEmployee = { ...employee, ...updates };
    db.employees.splice(index, 1, updatedEmployee);
    res.json(updatedEmployee);
};

export const deleteEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.employees.findIndex(emp => emp.id === id);
    if (index === -1) return res.status(404).json({ message: 'Employee not found' });

    db.employees.splice(index, 1);
    res.json({ message: 'Employee deleted' });
};

export const toggleEmployeeStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.employees.findIndex(emp => emp.id === id);
    if (index === -1) return res.status(404).json({ message: 'Employee not found' });

    const employee = db.employees[index];
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const updatedEmployee = {
        ...employee,
        status: (employee.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive'
    };

    // Use splice to trigger the Proxy's save logic
    db.employees.splice(index, 1, updatedEmployee);
    res.json(updatedEmployee);
};
