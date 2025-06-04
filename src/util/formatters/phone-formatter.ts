
export const formatPhone = (value?: string) => (
    value ? value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : ''
)
