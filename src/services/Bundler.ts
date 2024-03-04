
import { Bundler } from './clients/proto.gen.ts'


const bundler = new Bundler('http://192.168.122.23:3000', fetch)

export function loadOperations() {
  return bundler.operations()
}
