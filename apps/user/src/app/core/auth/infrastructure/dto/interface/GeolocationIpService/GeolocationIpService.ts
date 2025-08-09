import { Location } from '../../response';
export interface GeolocationIpService {
    getGeolocationByIp: (ip: string, format: string) => Location
}