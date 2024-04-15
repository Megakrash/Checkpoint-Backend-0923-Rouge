import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { Country, CountryCreateInput } from "../entities/Country";

@Resolver(Country)
export class CountriesResolver {
  // CREATE
  @Mutation(() => Country)
  async createCountry(@Arg("data") data: CountryCreateInput): Promise<Country> {
    const newCountry = new Country();
    Object.assign(newCountry, data);

    await newCountry.save();
    return newCountry;
  }

  // GET ALL
  @Query(() => [Country])
  async countriesGetAll(): Promise<Country[]> {
    const countries = await Country.find({
      order: { id: "ASC" },
    });
    return countries;
  }

  // GET BY COUNTRY CODE
  @Query(() => Country, { nullable: true })
  async countryByCode(
    @Arg("code", () => String) code: string
  ): Promise<Country | null> {
    const country = await Country.findOne({
      where: { code },
    });
    if (!country) {
      throw new Error("Country not found");
    }
    return country;
  }

  // GET COUNTRIES BY CONTINENT CODE
  @Query(() => [Country])
  async countriesByContinent(
    @Arg("continentCode", () => String) continentCode: string
  ): Promise<Country[]> {
    const countries = await Country.find({
      where: { continentCode },
    });
    return countries;
  }
}
