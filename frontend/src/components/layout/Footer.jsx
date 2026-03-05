import Container from "./Container";

export default function Footer() {
    return (
        <footer style={{ padding: "24px 0", borderTop: "1px solid rgba(148,163,184,0.2)", opacity: 0.8 }}>
            <Container>© {new Date().getFullYear()} Local Events</Container>
        </footer>
    );
}
