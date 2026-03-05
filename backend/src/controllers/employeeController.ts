import type { Request, Response } from 'express';
import Employee from '../models/Employee.js';

export const getEmployees = async (_req: Request, res: Response) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const employeeData = req.body;
        const newEmployee = new Employee({
            ...employeeData,
            id: employeeData.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Active'
        });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create employee' });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedEmployee = await Employee.findOneAndUpdate({ id } as any, req.body, { new: true });
        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Employee.findOneAndDelete({ id } as any);
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};

export const toggleEmployeeStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({ id } as any);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const newStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
        const updatedEmployee = await Employee.findOneAndUpdate(
            { id } as any,
            { status: newStatus },
            { new: true }
        );
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle status' });
    }
};
