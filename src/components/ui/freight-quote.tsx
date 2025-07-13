import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function FreightQuote() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get a Freight Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" placeholder="Enter origin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="Enter destination" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input id="weight" type="number" placeholder="Enter weight" />
          </div>
          <Button type="submit" className="w-full">Get Quote</Button>
        </form>
      </CardContent>
    </Card>
  );
}
