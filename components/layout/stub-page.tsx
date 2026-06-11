'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StubPage({
  title,
  breadcrumb,
  description,
}: {
  title: string;
  breadcrumb: string[];
  description: string;
}) {
  return (
    <AppShell title={title} breadcrumb={breadcrumb}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
