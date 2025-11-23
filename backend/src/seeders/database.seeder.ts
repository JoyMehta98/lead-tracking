import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { v7 as uuid } from "uuid";
import { UsersEntity } from "../modules/users/users.entity";
import { WebsitesEntity } from "../modules/websites/websites.entity";
import { WebsiteFormsEntity } from "../modules/websites/websites.forms.entity";
import { LeadsEntity } from "../modules/leads/leads.entity";

export class DatabaseSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    try {
      console.log("Starting database seeding...");

      // Create users
      const user = await this.seedUsers();
      console.log(`Created 1 user`);

      // Create websites
      const websites = await this.seedWebsites(user.id);
      console.log(`Created ${websites.length} websites`);

      // Create website forms
      const websiteForms = await this.seedWebsiteForms(websites);
      console.log(`Created ${websiteForms.length} website forms`);

      // Create leads
      const leads = await this.seedLeads(websites);
      console.log(`Created ${leads.length} leads`);

      console.log("Database seeding completed successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  }

  private async seedUsers(): Promise<UsersEntity> {
    const userRepository = this.dataSource.getRepository(UsersEntity);

    // Check if users already exist
    const existingUser = await userRepository.findOne({ where: { email: "admin@example.com" } });
    if (existingUser) {
      console.log("Admin user already exists, skipping user seeding");
      return existingUser;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("password123", saltRounds);
    const user = userRepository.create({
      id: uuid(),
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
    });

    return await userRepository.save(user);
  }

  private async seedWebsites(userId: string): Promise<WebsitesEntity[]> {
    const websiteRepository = this.dataSource.getRepository(WebsitesEntity);

    // Check if we already have enough websites
    const existingWebsites = await websiteRepository.find();
    if (existingWebsites.length >= 50) {
      console.log("Enough websites already exist, skipping website seeding");
      return existingWebsites.slice(0, 50);
    }

    // Generate 50 unique business names and domains
    const businessTypes = [
      "Tech",
      "Fashion",
      "Food",
      "Travel",
      "Fitness",
      "Health",
      "Beauty",
      "Finance",
      "Education",
      "Real Estate",
      "Automotive",
      "Entertainment",
      "Sports",
      "Home",
      "Garden",
      "Pets",
    ];

    const websites = Array(50)
      .fill(null)
      .map((_, i) => {
        const businessType = faker.helpers.arrayElement(businessTypes);
        const businessName = `${faker.company.name()} ${businessType}`;
        const domain = faker.internet.domainName().toLowerCase().replace(/\s+/g, "-");

        return {
          id: uuid(),
          name: businessName,
          url: `https://${domain}`,
          isActive: faker.datatype.boolean(0.9), // 90% chance of being active
          secretKey: this.generateRandomString(32),
          secretKeyExpiresAt: faker.date.between({
            from: faker.date.recent({ days: 30 }), // between 30 days ago
            to: faker.date.soon({ days: 365 }), // and 1 year from now
          }),
          createdBy: userId,
        };
      });

    // Save in chunks to avoid hitting parameter limits
    const chunkSize = 10;
    const savedWebsites: WebsitesEntity[] = [];

    for (let i = 0; i < websites.length; i += chunkSize) {
      const chunk = websites.slice(i, i + chunkSize);
      const savedChunk = await websiteRepository.save(chunk);
      savedWebsites.push(...savedChunk);
      console.log(`Saved websites ${i + 1}-${Math.min(i + chunkSize, websites.length)}/${websites.length}`);
    }

    return savedWebsites;
  }

  private async seedWebsiteForms(websites: WebsitesEntity[]): Promise<WebsiteFormsEntity[]> {
    const websiteFormRepository = this.dataSource.getRepository(WebsiteFormsEntity);

    // Check if we already have enough forms
    const existingFormsCount = await websiteFormRepository.count();
    const totalFormsNeeded = websites.length * 5; // 5 forms per website

    if (existingFormsCount >= totalFormsNeeded) {
      console.log("Enough website forms already exist, skipping form seeding");
      return websiteFormRepository.find({ take: totalFormsNeeded });
    }

    const formTypes = [
      "Contact",
      "Newsletter",
      "Support",
      "Quote",
      "Feedback",
      "Registration",
      "Appointment",
      "Survey",
      "Application",
      "Checkout",
      "Signup",
      "Lead Capture",
    ];

    const fieldTypes = [
      { type: "text", label: "Text" },
      { type: "email", label: "Email" },
      { type: "tel", label: "Phone" },
      { type: "number", label: "Number" },
      { type: "date", label: "Date" },
      { type: "textarea", label: "Text Area" },
      { type: "select", label: "Dropdown" },
      { type: "checkbox", label: "Checkbox" },
      { type: "radio", label: "Radio Button" },
    ];

    const websiteForms: any[] = [];

    for (const website of websites) {
      // Create 5 forms per website
      for (let i = 0; i < 5; i++) {
        const formType = faker.helpers.arrayElement(formTypes);
        const formName = `${formType} Form ${i + 1}`;
        const formSlug = formName.toLowerCase().replace(/\s+/g, "-");

        // Generate 5-8 random fields per form
        const fields = Array(5)
          .fill(null)
          .map((_, idx) => {
            const fieldType = faker.helpers.arrayElement(fieldTypes);
            const fieldName = faker.lorem.word();
            const isRequired = faker.datatype.boolean(0.7); // 70% chance of being required

            const field: any = {
              name: fieldName,
              type: fieldType.type,
              label: `${fieldType.label} Field ${idx + 1}`,
              required: isRequired,
              placeholder: `Enter your ${fieldName}...`,
            };

            if (fieldType.type === "select") {
              field.options = Array(2)
                .fill(null)
                .map((_, i) =>
                  faker.helpers.arrayElement([
                    `Option ${i + 1}`,
                    faker.commerce.productName(),
                    faker.commerce.department(),
                  ]),
                );
            }

            return field;
          });

        websiteForms.push({
          id: uuid(),
          websiteId: website.id,
          name: formName,
          action: `/${formSlug}`,
          method: faker.helpers.arrayElement(["POST", "GET"]),
          selector: `#${formSlug}`,
          fields,
        });
      }
    }

    // Save in chunks to avoid hitting parameter limits
    const chunkSize = 10;
    const savedForms: WebsiteFormsEntity[] = [];

    for (let i = 0; i < websiteForms.length; i += chunkSize) {
      const chunk = websiteForms.slice(i, i + chunkSize);
      const savedChunk = await websiteFormRepository.save(chunk);
      savedForms.push(...savedChunk);
      console.log(`Saved forms ${i + 1}-${Math.min(i + chunkSize, websiteForms.length)}/${websiteForms.length}`);
    }

    return savedForms;
  }

  private async seedLeads(websites: WebsitesEntity[]): Promise<LeadsEntity[]> {
    const leadRepository = this.dataSource.getRepository(LeadsEntity);
    const websiteFormRepository = this.dataSource.getRepository(WebsiteFormsEntity);

    // Check if we already have enough leads
    const existingLeadsCount = await leadRepository.count();
    const totalLeadsNeeded = websites.length * 5 * 20; // 50 websites * 5 forms * 20 leads

    if (existingLeadsCount >= totalLeadsNeeded) {
      console.log("Enough leads already exist, skipping lead seeding");
      return leadRepository.find({ take: totalLeadsNeeded });
    }

    // Get all forms to associate leads with
    const forms = await websiteFormRepository.find();
    if (forms.length === 0) {
      throw new Error("No forms found. Please seed forms first.");
    }

    interface FormField {
      name: string;
      type: string;
      label?: string;
      required?: boolean;
      placeholder?: string;
      options?: string[];
    }

    interface LeadData {
      id: string;
      websiteId: string;
      formId: string;
      data: Record<string, unknown>;
      meta: Record<string, unknown>;
      createdAt: Date;
    }

    const leads: LeadData[] = [];

    // For each form, create 20 leads
    for (const form of forms) {
      for (let i = 0; i < 20; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: "national" });

        // Find the website this form belongs to
        const website = websites.find((w) => w.id === form.websiteId);
        if (!website) continue;

        // Generate form submission data based on form fields
        const data: Record<string, any> = {};
        const meta: Record<string, any> = {
          userAgent: faker.internet.userAgent(),
          ip: faker.internet.ip(),
          referrer: faker.internet.url(),
          timestamp: faker.date.recent({ days: 30 }),
        };

        // Generate form data based on form fields
        const formFields = form.fields as FormField[];
        for (const field of formFields) {
          const fieldName = field.name || faker.lorem.word();

          switch (field.type) {
            case "text":
              data[fieldName] = fieldName.toLowerCase().includes("name")
                ? `${firstName} ${lastName}`
                : faker.lorem.words(3);
              break;
            case "email":
              data[fieldName] = email;
              break;
            case "tel":
              data[fieldName] = phone;
              break;
            case "number":
              data[fieldName] = faker.number.int(1000);
              break;
            case "date":
              data[fieldName] = faker.date.recent({ days: 30 });
              break;
            case "textarea":
              data[fieldName] = faker.lorem.paragraph();
              break;
            case "select":
              const options = field.options || ["Option 1", "Option 2", "Option 3"];
              data[fieldName] = faker.helpers.arrayElement(options);
              break;
            case "checkbox":
              data[fieldName] = faker.datatype.boolean();
              break;
            case "radio":
              data[fieldName] = faker.datatype.boolean() ? "Yes" : "No";
              break;
            default:
              data[fieldName] = faker.lorem.word();
          }
        }

        // Add some common fields if they don't exist
        if (!Object.keys(data).some((k) => k.toLowerCase().includes("name"))) {
          data["fullName"] = `${firstName} ${lastName}`;
        }
        if (!Object.keys(data).some((k) => k.toLowerCase().includes("email"))) {
          data["email"] = email;
        }
        if (!Object.keys(data).some((k) => k.toLowerCase().includes("phone"))) {
          data["phone"] = phone;
        }

        leads.push({
          id: uuid(),
          websiteId: website.id,
          formId: form.id,
          data,
          meta,
          createdAt: faker.date.between({
            from: faker.date.recent({ days: 30 }), // between 30 days ago
            to: new Date(),
          }),
        });
      }
    }

    // Save in chunks to avoid hitting parameter limits
    const chunkSize = 50;
    const savedLeads: LeadsEntity[] = [];

    for (let i = 0; i < leads.length; i += chunkSize) {
      const chunk = leads.slice(i, i + chunkSize);
      const savedChunk = await leadRepository.save(chunk);
      savedLeads.push(...savedChunk);
      console.log(`Saved leads ${i + 1}-${Math.min(i + chunkSize, leads.length)}/${leads.length}`);
    }

    return savedLeads;
  }

  private generateRandomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getFutureDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  // Helper to generate random date within a range
  private getRandomDate(from: Date, to: Date): Date {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
  }
}

// This function will be called to run the seeder
export async function runSeeder(dataSource: DataSource): Promise<void> {
  const seeder = new DatabaseSeeder(dataSource);
  await seeder.run();
}
