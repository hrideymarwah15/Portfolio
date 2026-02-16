import { getContact, getAvailability } from "@/lib/db";
import ContactPageClient from "./ContactPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Contact | Hridey Marwah",
    description: "Get in touch with me.",
};

export default async function ContactPage() {
    const [contact, availability] = await Promise.all([
        getContact(),
        getAvailability(),
    ]);

    return (
        <ContactPageClient
            contact={contact}
            availability={availability
                ? { isAvailable: availability.isAvailable, message: availability.message }
                : { isAvailable: true, message: "Available for new opportunities" }
            }
        />
    );
}
