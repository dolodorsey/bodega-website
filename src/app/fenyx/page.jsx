import { redirect } from 'next/navigation';

export default function BrandRoute() {
  redirect('/shop?brand=fenyx');
}
