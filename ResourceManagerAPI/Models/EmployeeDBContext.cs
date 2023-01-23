using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ResourceManagerAPI.Models
{
    public partial class EmployeeDBContext : DbContext
    {
        public EmployeeDBContext(DbContextOptions<EmployeeDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Employee> employee { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>(entity =>
            {

                entity.Property(e => e.name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.email_address)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                //  entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.task_name)
                      .HasMaxLength(250)
                      .IsUnicode(false);
                entity.Property(e => e.start)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.finish)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}