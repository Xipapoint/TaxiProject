import { Injectable } from "@nestjs/common";
import axios from "axios";
import { GeolocationByIp, Location } from '../dto';

@Injectable()
export class LocationIpService {
    async getGeolocationByIp(ip: string, format = "json"): Promise<Location> {
        const result: GeolocationByIp = await axios.get(`https://ipapi.co/${ip}/${format}/`)
        return {
            countryCode: result.country_code,
            country_name: result.country_name,
            city: result.city,
            latitude: result.latitude,
            longitude: result.longitude
        }
    }
}