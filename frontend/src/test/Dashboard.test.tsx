import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/admin/Dashboard'

describe('Dashboard Component', () => {
    it('renders dashboard title', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        )

        expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument()
    })

    it('renders quick action cards', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        )

        expect(screen.getByText(/User Management/i)).toBeInTheDocument()
        expect(screen.getByText(/Content Management/i)).toBeInTheDocument()
    })
})
