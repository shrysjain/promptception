import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <footer className="mt-10 py-6 md:py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          Made with{" "}
          <span role="img" aria-label="love" className="text-red-500">
            ❤️
          </span>{" "}
          by{" "}
          <Link
            href="https://shrysjain.me"
            className="font-medium underline underline-offset-4 hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shreyas Jain
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
